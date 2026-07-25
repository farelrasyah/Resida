<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Enums\HouseOccupancyStatus;
use App\Models\House;
use App\Repositories\Contracts\HouseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Pagination\LengthAwarePaginator;

class HouseRepository implements HouseRepositoryInterface
{
    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = House::query();

        if (! empty($filters['search'])) {
            $query->where('house_number', 'like', '%' . $filters['search'] . '%');
        }

        if (! empty($filters['occupancy_status'])) {
            $query->where('occupancy_status', $filters['occupancy_status']);
        }

        if (! empty($filters['sort'])) {
            $direction = str_starts_with($filters['sort'], '-') ? 'desc' : 'asc';
            $column = ltrim($filters['sort'], '-');
            $allowed = ['house_number', 'created_at', 'occupancy_status'];
            if (in_array($column, $allowed, true)) {
                $query->orderBy($column, $direction);
            }
        } else {
            $query->orderBy('house_number');
        }

        return $query->paginate(min($perPage, 100));
    }

    public function getAllWithoutPagination(): Collection
    {
        return House::orderBy('house_number')->get();
    }

    public function findById(int $id): ?House
    {
        return House::find($id);
    }

    public function findByIdOrFail(int $id): House
    {
        $house = House::find($id);

        if (! $house) {
            throw new ModelNotFoundException("House with ID {$id} not found.");
        }

        return $house;
    }

    public function findByIdWithLock(int $id): House
    {
        $house = House::lockForUpdate()->find($id);

        if (! $house) {
            throw new ModelNotFoundException("House with ID {$id} not found.");
        }

        return $house;
    }

    public function create(array $data): House
    {
        return House::create($data);
    }

    public function update(House $house, array $data): House
    {
        $house->update($data);

        return $house->fresh();
    }

    public function updateOccupancyStatus(House $house, string $status): void
    {
        $house->update(['occupancy_status' => $status]);
    }

    public function softDelete(House $house): bool
    {
        return (bool) $house->delete();
    }

    public function countByStatus(): array
    {
        $total = House::count();
        $occupied = House::where('occupancy_status', HouseOccupancyStatus::Dihuni)->count();

        return [
            'total' => $total,
            'occupied' => $occupied,
            'vacant' => $total - $occupied,
        ];
    }
}
