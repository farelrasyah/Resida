<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Enums\PaymentStatus;
use App\Models\PaymentPeriod;
use App\Repositories\Contracts\PaymentPeriodRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class PaymentPeriodRepository implements PaymentPeriodRepositoryInterface
{
    public function createMany(array $periods): void
    {
        foreach ($periods as $period) {
            PaymentPeriod::create($period);
        }
    }

    /**
     * Check if a finalized payment period exists for a given house+dues+year+month combination.
     */
    public function existsForHouseDuesPeriod(int $houseId, int $duesTypeId, int $year, int $month): bool
    {
        return PaymentPeriod::where('house_id', $houseId)
            ->where('dues_type_id', $duesTypeId)
            ->where('period_year', $year)
            ->where('period_month', $month)
            ->whereHas('payment', fn ($q) => $q->where('status', PaymentStatus::Lunas))
            ->exists();
    }

    /**
     * Get all payment periods for a given month, joined with finalized payments.
     */
    public function getPeriodsForMonth(int $year, int $month): Collection
    {
        return PaymentPeriod::with(['payment.resident', 'house', 'duesType'])
            ->where('period_year', $year)
            ->where('period_month', $month)
            ->whereHas('payment', fn ($q) => $q->where('status', PaymentStatus::Lunas))
            ->get();
    }

    /**
     * Get paid periods for a specific house in a given month.
     */
    public function getPaidPeriodsForHouseInMonth(int $houseId, int $year, int $month): Collection
    {
        return PaymentPeriod::where('house_id', $houseId)
            ->where('period_year', $year)
            ->where('period_month', $month)
            ->whereHas('payment', fn ($q) => $q->where('status', PaymentStatus::Lunas))
            ->with('duesType')
            ->get();
    }
}
