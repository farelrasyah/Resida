<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\House\StoreHouseRequest;
use App\Http\Requests\V1\House\UpdateHouseRequest;
use App\Http\Requests\V1\Occupancy\AssignResidentRequest;
use App\Http\Resources\V1\HouseDetailResource;
use App\Http\Resources\V1\HouseResource;
use App\Http\Resources\V1\OccupancyResource;
use App\Http\Resources\V1\PaymentResource;
use App\Services\HouseService;
use App\Services\OccupancyService;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HouseController extends Controller
{
    public function __construct(
        private readonly HouseService $houseService,
        private readonly OccupancyService $occupancyService,
        private readonly PaymentService $paymentService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->houseService->getAll(
            filters: $request->only(['search', 'occupancy_status', 'sort']),
            perPage: (int) $request->input('per_page', 15),
        );

        return ApiResponse::paginated($paginator, HouseResource::class);
    }

    public function store(StoreHouseRequest $request): JsonResponse
    {
        $house = $this->houseService->create($request->validated());

        return ApiResponse::success(
            new HouseResource($house),
            'Rumah berhasil ditambahkan',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $house = $this->houseService->findById($id);
        $house->load('activeOccupancy.resident');

        return ApiResponse::success(
            new HouseDetailResource($house),
            'Data rumah berhasil diambil'
        );
    }

    public function update(UpdateHouseRequest $request, int $id): JsonResponse
    {
        $house = $this->houseService->update($id, $request->validated());

        return ApiResponse::success(
            new HouseResource($house),
            'Data rumah berhasil diperbarui'
        );
    }

    public function deactivate(int $id): JsonResponse
    {
        $this->houseService->deactivate($id);

        return ApiResponse::success(null, 'Rumah berhasil dinonaktifkan');
    }

    public function occupancyHistory(int $id): JsonResponse
    {
        $history = $this->occupancyService->getHistoryByHouseId($id);

        return ApiResponse::success(
            OccupancyResource::collection($history),
            'Riwayat penghuni berhasil diambil'
        );
    }

    public function paymentHistory(Request $request, int $id): JsonResponse
    {
        $payments = $this->paymentService->getByHouseId($id, $request->only(['dues_type_id', 'year']));

        return ApiResponse::success(
            PaymentResource::collection($payments),
            'Riwayat pembayaran berhasil diambil'
        );
    }

    public function assignResident(AssignResidentRequest $request, int $id): JsonResponse
    {
        $occupancy = $this->occupancyService->assignResident(
            $id,
            (int) $request->validated('resident_id')
        );

        return ApiResponse::success(
            new OccupancyResource($occupancy),
            'Penghuni berhasil ditempatkan',
            201
        );
    }

    public function reassignResident(AssignResidentRequest $request, int $id): JsonResponse
    {
        $occupancy = $this->occupancyService->reassignResident(
            $id,
            (int) $request->validated('resident_id')
        );

        return ApiResponse::success(
            new OccupancyResource($occupancy),
            'Penghuni berhasil dipindahkan'
        );
    }
}
