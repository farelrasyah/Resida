<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\HouseOccupancyStatus;
use App\Exceptions\Domain\HouseAlreadyOccupiedException;
use App\Exceptions\Domain\ResidentAlreadyActiveException;
use App\Models\Occupancy;
use App\Repositories\Contracts\HouseRepositoryInterface;
use App\Repositories\Contracts\OccupancyRepositoryInterface;
use App\Repositories\Contracts\ResidentRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class OccupancyService
{
    public function __construct(
        private readonly OccupancyRepositoryInterface $occupancyRepository,
        private readonly HouseRepositoryInterface $houseRepository,
        private readonly ResidentRepositoryInterface $residentRepository,
    ) {}

    /**
     * Assign a resident to a vacant house.
     *
     * BR-1: One house = one active occupancy at a time.
     * BR-2: One resident = one active occupancy at a time.
     * BR-4: Always INSERT, never reactivate old occupancy.
     * BR-5: Sync house.occupancy_status within transaction.
     *
     * @throws HouseAlreadyOccupiedException
     * @throws ResidentAlreadyActiveException
     */
    public function assignResident(int $houseId, int $residentId): Occupancy
    {
        return DB::transaction(function () use ($houseId, $residentId) {
            // Lock house row to prevent race conditions
            $house = $this->houseRepository->findByIdWithLock($houseId);

            // BR-1: Check house is not already occupied
            $existingOccupancy = $this->occupancyRepository->findActiveByHouseIdWithLock($houseId);
            if ($existingOccupancy) {
                throw new HouseAlreadyOccupiedException();
            }

            // BR-2: Check resident is not active elsewhere
            $residentOccupancy = $this->occupancyRepository->findActiveByResidentIdWithLock($residentId);
            if ($residentOccupancy) {
                throw new ResidentAlreadyActiveException();
            }

            // Validate resident exists
            $this->residentRepository->findByIdOrFail($residentId);

            // BR-4: Always create new occupancy record
            $occupancy = $this->occupancyRepository->create([
                'house_id' => $houseId,
                'resident_id' => $residentId,
                'start_date' => now()->toDateString(),
                'end_date' => null,
            ]);

            // BR-5: Sync house occupancy status
            $this->houseRepository->updateOccupancyStatus($house, HouseOccupancyStatus::Dihuni->value);

            return $occupancy->load('resident', 'house');
        });
    }

    /**
     * Reassign a house to a new resident, closing the current occupancy.
     *
     * BR-3: Close old occupancy (end_date = today), open new one.
     * BR-5: Sync house.occupancy_status within transaction.
     *
     * @throws ResidentAlreadyActiveException
     */
    public function reassignResident(int $houseId, int $newResidentId): Occupancy
    {
        return DB::transaction(function () use ($houseId, $newResidentId) {
            $house = $this->houseRepository->findByIdWithLock($houseId);

            // Close existing occupancy if any
            $existingOccupancy = $this->occupancyRepository->findActiveByHouseIdWithLock($houseId);
            if ($existingOccupancy) {
                // Edge case: same resident trying to reassign to same house
                if ($existingOccupancy->resident_id === $newResidentId) {
                    throw new ResidentAlreadyActiveException('Penghuni sudah menempati rumah ini');
                }
                $this->occupancyRepository->closeOccupancy($existingOccupancy, now()->toDateString());
            }

            // BR-2: Check new resident is not active elsewhere
            $residentOccupancy = $this->occupancyRepository->findActiveByResidentIdWithLock($newResidentId);
            if ($residentOccupancy) {
                throw new ResidentAlreadyActiveException();
            }

            $this->residentRepository->findByIdOrFail($newResidentId);

            $occupancy = $this->occupancyRepository->create([
                'house_id' => $houseId,
                'resident_id' => $newResidentId,
                'start_date' => now()->toDateString(),
                'end_date' => null,
            ]);

            // BR-5: Ensure house status stays dihuni
            $this->houseRepository->updateOccupancyStatus($house, HouseOccupancyStatus::Dihuni->value);

            return $occupancy->load('resident', 'house');
        });
    }

    /**
     * End an occupancy (resident moves out), marking the house as vacant.
     */
    public function endOccupancy(int $houseId): void
    {
        DB::transaction(function () use ($houseId) {
            $house = $this->houseRepository->findByIdWithLock($houseId);

            $occupancy = $this->occupancyRepository->findActiveByHouseIdWithLock($houseId);
            if ($occupancy) {
                $this->occupancyRepository->closeOccupancy($occupancy, now()->toDateString());
            }

            $this->houseRepository->updateOccupancyStatus($house, HouseOccupancyStatus::TidakDihuni->value);
        });
    }

    /**
     * Get occupancy history for a house.
     */
    public function getHistoryByHouseId(int $houseId): Collection
    {
        $this->houseRepository->findByIdOrFail($houseId);

        return $this->occupancyRepository->getHistoryByHouseId($houseId);
    }

    /**
     * Find the active occupancy for a house (used by PaymentService).
     */
    public function findActiveByHouseId(int $houseId): ?Occupancy
    {
        return $this->occupancyRepository->findActiveByHouseId($houseId);
    }
}
