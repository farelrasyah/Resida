<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Resident\StoreResidentRequest;
use App\Http\Requests\V1\Resident\UpdateResidentRequest;
use App\Http\Resources\V1\ResidentResource;
use App\Services\ResidentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResidentController extends Controller
{
    public function __construct(
        private readonly ResidentService $residentService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->residentService->getAll(
            filters: $request->only(['search', 'resident_status', 'sort']),
            perPage: (int) $request->input('per_page', 15),
        );

        return ApiResponse::paginated($paginator, ResidentResource::class);
    }

    public function store(StoreResidentRequest $request): JsonResponse
    {
        $resident = $this->residentService->create(
            $request->safe()->except('ktp_photo'),
            $request->file('ktp_photo'),
        );

        return ApiResponse::success(
            new ResidentResource($resident),
            'Penghuni berhasil ditambahkan',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $resident = $this->residentService->findById($id);

        return ApiResponse::success(
            new ResidentResource($resident),
            'Data penghuni berhasil diambil'
        );
    }

    public function update(UpdateResidentRequest $request, int $id): JsonResponse
    {
        $resident = $this->residentService->findById($id);
        $updated = $this->residentService->update(
            $resident,
            $request->safe()->except('ktp_photo'),
            $request->file('ktp_photo'),
        );

        return ApiResponse::success(
            new ResidentResource($updated),
            'Data penghuni berhasil diperbarui'
        );
    }

    public function deactivate(int $id): JsonResponse
    {
        $this->residentService->deactivate($id);

        return ApiResponse::success(null, 'Penghuni berhasil dinonaktifkan');
    }
}
