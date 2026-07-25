<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\Domain\HouseStillOccupiedException;
use App\Enums\HouseOccupancyStatus;
use App\Models\House;
use App\Repositories\Contracts\HouseRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class HouseService
{
    public function __construct(
        private readonly HouseRepositoryInterface $houseRepository,
    ) {}

    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->houseRepository->getAll($filters, $perPage);
    }

    public function findById(int $id): House
    {
        return $this->houseRepository->findByIdOrFail($id);
    }

    public function create(array $data): House
    {
        $data['occupancy_status'] = HouseOccupancyStatus::TidakDihuni->value;

        return $this->houseRepository->create($data);
    }

    public function update(int $id, array $data): House
    {
        $house = $this->houseRepository->findByIdOrFail($id);

        return $this->houseRepository->update($house, $data);
    }

    /**
     * Soft-delete a house. Only allowed if the house is not currently occupied.
     *
     * @throws HouseStillOccupiedException
     */
    public function deactivate(int $id): void
    {
        $house = $this->houseRepository->findByIdOrFail($id);

        if ($house->occupancy_status === HouseOccupancyStatus::Dihuni) {
            throw new HouseStillOccupiedException();
        }

        $this->houseRepository->softDelete($house);
    }
}
