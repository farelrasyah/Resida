<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\DuesType\UpdateDuesTypeRequest;
use App\Http\Resources\V1\DuesTypeResource;
use App\Services\DuesTypeService;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class DuesTypeController extends Controller
{
    public function __construct(
        private readonly DuesTypeService $duesTypeService,
    ) {}

    #[OA\Get(
        path: '/dues-types',
        summary: 'Daftar jenis iuran',
        description: 'Seluruh jenis iuran (satpam, kebersihan) beserta nominal.',
        security: [['bearerAuth' => []]],
        tags: ['Dues Types'],
        responses: [
            new OA\Response(response: 200, description: 'Data jenis iuran berhasil diambil.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
        ]
    )]
    public function index(): JsonResponse
    {
        $duesTypes = $this->duesTypeService->getAll();

        return ApiResponse::success(
            DuesTypeResource::collection($duesTypes),
            'Data jenis iuran berhasil diambil'
        );
    }

    #[OA\Put(
        path: '/dues-types/{id}',
        summary: 'Update nominal iuran',
        description: 'Update nominal iuran. Perubahan hanya berlaku untuk pembayaran baru (snapshot).',
        security: [['bearerAuth' => []]],
        tags: ['Dues Types'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID jenis iuran', schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['amount'],
                properties: [
                    new OA\Property(property: 'amount', type: 'number', format: 'float', example: 60000.00, description: 'Nominal baru (harus > 0)'),
                ],
                type: 'object'
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Nominal iuran berhasil diperbarui.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 404, description: 'Jenis iuran tidak ditemukan.'),
            new OA\Response(response: 422, description: 'Validasi gagal.'),
        ]
    )]
    public function update(UpdateDuesTypeRequest $request, int $id): JsonResponse
    {
        $duesType = $this->duesTypeService->updateAmount($id, (float) $request->validated('amount'));

        return ApiResponse::success(
            new DuesTypeResource($duesType),
            'Nominal iuran berhasil diperbarui'
        );
    }
}
