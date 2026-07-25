<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\House;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface HouseRepositoryInterface
{
    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function getAllWithoutPagination(): Collection;

    public function findById(int $id): ?House;

    public function findByIdOrFail(int $id): House;

    public function findByIdWithLock(int $id): House;

    public function create(array $data): House;

    public function update(House $house, array $data): House;

    public function updateOccupancyStatus(House $house, string $status): void;

    public function softDelete(House $house): bool;

    public function countByStatus(): array;
}
