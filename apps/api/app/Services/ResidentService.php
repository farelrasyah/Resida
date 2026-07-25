<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\Domain\ResidentHasActiveOccupancyException;
use App\Models\Resident;
use App\Repositories\Contracts\OccupancyRepositoryInterface;
use App\Repositories\Contracts\ResidentRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class ResidentService
{
    public function __construct(
        private readonly ResidentRepositoryInterface $residentRepository,
        private readonly OccupancyRepositoryInterface $occupancyRepository,
    ) {}

    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->residentRepository->getAll($filters, $perPage);
    }

    public function findById(int $id): Resident
    {
        return $this->residentRepository->findByIdOrFail($id);
    }

    /**
     * Create a new resident with KTP photo upload.
     */
    public function create(array $data, UploadedFile $ktpPhoto): Resident
    {
        $path = $ktpPhoto->store('ktp', 'public');
        $data['ktp_photo_path'] = $path;

        return $this->residentRepository->create($data);
    }

    /**
     * Update a resident. If a new KTP photo is provided, delete the old one.
     */
    public function update(Resident $resident, array $data, ?UploadedFile $ktpPhoto = null): Resident
    {
        if ($ktpPhoto) {
            // Delete old file
            if ($resident->ktp_photo_path && Storage::disk('public')->exists($resident->ktp_photo_path)) {
                Storage::disk('public')->delete($resident->ktp_photo_path);
            }

            $data['ktp_photo_path'] = $ktpPhoto->store('ktp', 'public');
        }

        return $this->residentRepository->update($resident, $data);
    }

    /**
     * Soft-delete a resident. Only allowed if the resident has no active occupancy.
     *
     * @throws ResidentHasActiveOccupancyException
     */
    public function deactivate(int $id): void
    {
        $resident = $this->residentRepository->findByIdOrFail($id);

        $activeOccupancy = $this->occupancyRepository->findActiveByResidentId($resident->id);
        if ($activeOccupancy) {
            throw new ResidentHasActiveOccupancyException();
        }

        $this->residentRepository->softDelete($resident);
    }
}
