<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Enums\PaymentStatus;
use App\Models\Payment;
use App\Models\PaymentPeriod;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PaymentRepository implements PaymentRepositoryInterface
{
    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Payment::with(['house', 'resident', 'duesType', 'periods']);

        if (! empty($filters['house_id'])) {
            $query->where('house_id', $filters['house_id']);
        }

        if (! empty($filters['resident_id'])) {
            $query->where('resident_id', $filters['resident_id']);
        }

        if (! empty($filters['dues_type_id'])) {
            $query->where('dues_type_id', $filters['dues_type_id']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['year'])) {
            $query->whereYear('payment_date', $filters['year']);
        }

        if (! empty($filters['month'])) {
            $query->whereMonth('payment_date', $filters['month']);
        }

        $query->latest('payment_date');

        return $query->paginate(min($perPage, 100));
    }

    public function findById(int $id): ?Payment
    {
        return Payment::with(['house', 'resident', 'duesType', 'periods'])->find($id);
    }

    public function findByIdOrFail(int $id): Payment
    {
        $payment = Payment::with(['house', 'resident', 'duesType', 'periods'])->find($id);

        if (! $payment) {
            throw new ModelNotFoundException("Payment with ID {$id} not found.");
        }

        return $payment;
    }

    public function create(array $data): Payment
    {
        return Payment::create($data);
    }

    public function updateStatus(Payment $payment, string $status): void
    {
        $payment->update(['status' => $status]);
    }

    public function getByHouseId(int $houseId, array $filters = []): Collection
    {
        $query = Payment::with(['resident', 'duesType', 'periods'])
            ->where('house_id', $houseId);

        if (! empty($filters['dues_type_id'])) {
            $query->where('dues_type_id', $filters['dues_type_id']);
        }

        if (! empty($filters['year'])) {
            $query->whereYear('payment_date', $filters['year']);
        }

        return $query->latest('payment_date')->get();
    }

    /**
     * Get monthly income grouped by period month for a given year.
     * Income is calculated from payment_periods linked to finalized payments.
     *
     * @return array<int, float> month (1-12) => total amount
     */
    public function getMonthlyIncomeByPeriods(int $year): array
    {
        $results = PaymentPeriod::join('payments', 'payment_periods.payment_id', '=', 'payments.id')
            ->where('payments.status', PaymentStatus::Lunas->value)
            ->where('payment_periods.period_year', $year)
            ->select(
                'payment_periods.period_month',
                DB::raw('SUM(payments.amount) as total')
            )
            ->groupBy('payment_periods.period_month')
            ->get();

        $monthly = array_fill(1, 12, 0.0);
        foreach ($results as $row) {
            $monthly[(int) $row->period_month] = (float) $row->total;
        }

        return $monthly;
    }

    /**
     * Get total income from all finalized payments before a given year.
     */
    public function getIncomeBeforeYear(int $year): float
    {
        return (float) PaymentPeriod::join('payments', 'payment_periods.payment_id', '=', 'payments.id')
            ->where('payments.status', PaymentStatus::Lunas->value)
            ->where('payment_periods.period_year', '<', $year)
            ->sum('payments.amount');
    }
}
