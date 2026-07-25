<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\DuesType\UpdateDuesTypeRequest;
use App\Http\Resources\V1\DuesTypeResource;
use App\Services\DuesTypeService;
use Illuminate\Http\JsonResponse;

class DuesTypeController extends Controller
{
    public function __construct(
        private readonly DuesTypeService $duesTypeService,
    ) {}

    public function index(): JsonResponse
    {
        $duesTypes = $this->duesTypeService->getAll();

        return ApiResponse::success(
            DuesTypeResource::collection($duesTypes),
            'Data jenis iuran berhasil diambil'
        );
    }

    public function update(UpdateDuesTypeRequest $request, int $id): JsonResponse
    {
        $duesType = $this->duesTypeService->updateAmount($id, (float) $request->validated('amount'));

        return ApiResponse::success(
            new DuesTypeResource($duesType),
            'Nominal iuran berhasil diperbarui'
        );
    }
}
