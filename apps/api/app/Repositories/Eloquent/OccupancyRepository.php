<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Occupancy;
use App\Repositories\Contracts\OccupancyRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class OccupancyRepository implements OccupancyRepositoryInterface
{
    public function findActiveByHouseId(int $houseId): ?Occupancy
    {
        return Occupancy::where('house_id', $houseId)
            ->whereNull('end_date')
            ->with('resident')
            ->first();
    }

    public function findActiveByResidentId(int $residentId): ?Occupancy
    {
        return Occupancy::where('resident_id', $residentId)
            ->whereNull('end_date')
            ->with('house')
            ->first();
    }

    public function findActiveByHouseIdWithLock(int $houseId): ?Occupancy
    {
        return Occupancy::where('house_id', $houseId)
            ->whereNull('end_date')
            ->lockForUpdate()
            ->first();
    }

    public function findActiveByResidentIdWithLock(int $residentId): ?Occupancy
    {
        return Occupancy::where('resident_id', $residentId)
            ->whereNull('end_date')
            ->lockForUpdate()
            ->first();
    }

    public function create(array $data): Occupancy
    {
        return Occupancy::create($data);
    }

    public function closeOccupancy(Occupancy $occupancy, string $endDate): void
    {
        $occupancy->update(['end_date' => $endDate]);
    }

    public function getHistoryByHouseId(int $houseId): Collection
    {
        return Occupancy::where('house_id', $houseId)
            ->with('resident')
            ->orderByDesc('start_date')
            ->get();
    }

    public function getHistoryByResidentId(int $residentId): Collection
    {
        return Occupancy::where('resident_id', $residentId)
            ->with('house')
            ->orderByDesc('start_date')
            ->get();
    }
}
