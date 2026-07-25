<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Resident;
use Illuminate\Pagination\LengthAwarePaginator;

interface ResidentRepositoryInterface
{
    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?Resident;

    public function findByIdOrFail(int $id): Resident;

    public function create(array $data): Resident;

    public function update(Resident $resident, array $data): Resident;

    public function softDelete(Resident $resident): bool;
}
