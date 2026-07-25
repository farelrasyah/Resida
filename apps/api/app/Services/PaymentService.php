<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\PaymentStatus;
use App\Exceptions\Domain\HouseNotOccupiedException;
use App\Exceptions\Domain\PaymentAlreadyFinalizedException;
use App\Exceptions\Domain\PeriodAlreadyPaidException;
use App\Models\DuesType;
use App\Models\Payment;
use App\Repositories\Contracts\PaymentPeriodRepositoryInterface;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentService
{
    public function __construct(
        private readonly PaymentRepositoryInterface $paymentRepository,
        private readonly PaymentPeriodRepositoryInterface $paymentPeriodRepository,
        private readonly OccupancyService $occupancyService,
    ) {}

    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->paymentRepository->getAll($filters, $perPage);
    }

    public function findById(int $id): Payment
    {
        return $this->paymentRepository->findByIdOrFail($id);
    }

    public function getByHouseId(int $houseId, array $filters = []): Collection
    {
        return $this->paymentRepository->getByHouseId($houseId, $filters);
    }

    /**
     * Create a new payment with period breakdown.
     *
     * Implements:
     * - BR-7: Auto-breakdown to N payment_periods
     * - BR-11: Unique transaction_number generation
     * - BR-14: Snapshot amount from DuesType
     * - ADR-005: Snapshot nominal
     * - ADR-009: Records resident_id for audit
     *
     * @throws HouseNotOccupiedException
     * @throws PeriodAlreadyPaidException
     */
    public function createPayment(array $data): Payment
    {
        return DB::transaction(function () use ($data) {
            $houseId = (int) $data['house_id'];
            $duesTypeId = (int) $data['dues_type_id'];
            $periodStartYear = (int) $data['period_start_year'];
            $periodStartMonth = (int) $data['period_start_month'];
            $periodCount = (int) ($data['period_count'] ?? 1);
            $paymentDate = $data['payment_date'];
            $notes = $data['notes'] ?? null;

            // Get active resident for this house
            $activeOccupancy = $this->occupancyService->findActiveByHouseId($houseId);
            if (! $activeOccupancy) {
                throw new HouseNotOccupiedException();
            }

            // BR-14: Snapshot amount from DuesType
            $duesType = DuesType::findOrFail($duesTypeId);
            $snapshotAmount = (float) $duesType->amount;
            $totalAmount = $snapshotAmount * $periodCount;

            // BR-11: Generate unique transaction number
            $transactionNumber = $this->generateTransactionNumber($paymentDate);

            // Create payment header
            $payment = $this->paymentRepository->create([
                'transaction_number' => $transactionNumber,
                'house_id' => $houseId,
                'resident_id' => $activeOccupancy->resident_id, // ADR-009
                'dues_type_id' => $duesTypeId,
                'amount' => $snapshotAmount,
                'total_amount' => $totalAmount,
                'payment_date' => $paymentDate,
                'status' => PaymentStatus::Lunas->value,
                'notes' => $notes,
            ]);

            // BR-7: Create period breakdown
            $periods = [];
            $year = $periodStartYear;
            $month = $periodStartMonth;

            for ($i = 0; $i < $periodCount; $i++) {
                // Check for duplicate period (finalized payment already covering this period)
                if ($this->paymentPeriodRepository->existsForHouseDuesPeriod($houseId, $duesTypeId, $year, $month)) {
                    throw new PeriodAlreadyPaidException(
                        "Periode {$month}/{$year} untuk jenis iuran ini sudah tercatat lunas sebelumnya"
                    );
                }

                $periods[] = [
                    'payment_id' => $payment->id,
                    'house_id' => $houseId,
                    'dues_type_id' => $duesTypeId,
                    'period_year' => $year,
                    'period_month' => $month,
                ];

                // Advance to next month
                $month++;
                if ($month > 12) {
                    $month = 1;
                    $year++;
                }
            }

            $this->paymentPeriodRepository->createMany($periods);

            return $payment->load(['house', 'resident', 'duesType', 'periods']);
        });
    }

    /**
     * Cancel a payment (soft cancel via status change).
     *
     * BR-9: Payment cannot be edited after finalization.
     * BR-10: Payment can be cancelled, not deleted. PaymentPeriods remain for history.
     *
     * @throws PaymentAlreadyFinalizedException
     */
    public function cancelPayment(int $id): Payment
    {
        $payment = $this->paymentRepository->findByIdOrFail($id);

        if ($payment->status === PaymentStatus::Dibatalkan) {
            throw new PaymentAlreadyFinalizedException();
        }

        $this->paymentRepository->updateStatus($payment, PaymentStatus::Dibatalkan->value);

        return $payment->fresh(['house', 'resident', 'duesType', 'periods']);
    }

    /**
     * Generate a unique transaction number in format PAY-YYYYMMDD-XXXX.
     * Retries on collision (BR-11).
     */
    private function generateTransactionNumber(string $paymentDate): string
    {
        $date = date('Ymd', strtotime($paymentDate));
        $maxAttempts = 10;

        for ($i = 0; $i < $maxAttempts; $i++) {
            $number = 'PAY-' . $date . '-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT);

            $exists = Payment::where('transaction_number', $number)->exists();
            if (! $exists) {
                return $number;
            }
        }

        // Fallback with UUID suffix if all random attempts collide (extremely unlikely)
        return 'PAY-' . $date . '-' . strtoupper(Str::random(4));
    }
}
