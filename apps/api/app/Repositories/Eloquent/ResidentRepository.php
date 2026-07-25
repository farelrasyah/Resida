<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Resident;
use App\Repositories\Contracts\ResidentRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Pagination\LengthAwarePaginator;

class ResidentRepository implements ResidentRepositoryInterface
{
    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Resident::query();

        if (! empty($filters['search'])) {
            $query->where('full_name', 'like', '%' . $filters['search'] . '%');
        }

        if (! empty($filters['resident_status'])) {
            $query->where('resident_status', $filters['resident_status']);
        }

        if (! empty($filters['sort'])) {
            $direction = str_starts_with($filters['sort'], '-') ? 'desc' : 'asc';
            $column = ltrim($filters['sort'], '-');
            $allowed = ['full_name', 'created_at', 'resident_status'];
            if (in_array($column, $allowed, true)) {
                $query->orderBy($column, $direction);
            }
        } else {
            $query->latest();
        }

        return $query->paginate(min($perPage, 100));
    }

    public function findById(int $id): ?Resident
    {
        return Resident::find($id);
    }

    public function findByIdOrFail(int $id): Resident
    {
        $resident = Resident::find($id);

        if (! $resident) {
            throw new ModelNotFoundException("Resident with ID {$id} not found.");
        }

        return $resident;
    }

    public function create(array $data): Resident
    {
        return Resident::create($data);
    }

    public function update(Resident $resident, array $data): Resident
    {
        $resident->update($data);

        return $resident->fresh();
    }

    public function softDelete(Resident $resident): bool
    {
        return (bool) $resident->delete();
    }
}
