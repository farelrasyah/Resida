<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface PaymentPeriodRepositoryInterface
{
    public function createMany(array $periods): void;

    public function existsForHouseDuesPeriod(int $houseId, int $duesTypeId, int $year, int $month): bool;

    public function getPeriodsForMonth(int $year, int $month): Collection;

    public function getPaidPeriodsForHouseInMonth(int $houseId, int $year, int $month): Collection;
}
