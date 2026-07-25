<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Occupancy;
use Illuminate\Database\Eloquent\Collection;

interface OccupancyRepositoryInterface
{
    public function findActiveByHouseId(int $houseId): ?Occupancy;

    public function findActiveByResidentId(int $residentId): ?Occupancy;

    public function findActiveByHouseIdWithLock(int $houseId): ?Occupancy;

    public function findActiveByResidentIdWithLock(int $residentId): ?Occupancy;

    public function create(array $data): Occupancy;

    public function closeOccupancy(Occupancy $occupancy, string $endDate): void;

    public function getHistoryByHouseId(int $houseId): Collection;

    public function getHistoryByResidentId(int $residentId): Collection;
}
