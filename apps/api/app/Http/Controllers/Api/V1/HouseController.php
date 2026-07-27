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
use OpenApi\Attributes as OA;

class HouseController extends Controller
{
    public function __construct(
        private readonly HouseService $houseService,
        private readonly OccupancyService $occupancyService,
        private readonly PaymentService $paymentService,
    ) {}

    #[OA\Get(
        path: '/houses',
        summary: 'Daftar rumah (paginasi)',
        description: 'Daftar rumah dengan paginasi. Mendukung pencarian, filter status hunian, dan sorting.',
        security: [['bearerAuth' => []]],
        tags: ['Houses'],
        parameters: [
            new OA\Parameter(name: 'search', in: 'query', description: 'Cari nomor rumah', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'occupancy_status', in: 'query', description: 'Filter status hunian', required: false, schema: new OA\Schema(type: 'string', enum: ['dihuni', 'tidak_dihuni'])),
            new OA\Parameter(name: 'sort', in: 'query', description: 'Sorting. Prefix - untuk desc. Kolom: house_number, created_at, occupancy_status.', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'page', in: 'query', description: 'Halaman', required: false, schema: new OA\Schema(type: 'integer', default: 1)),
            new OA\Parameter(name: 'per_page', in: 'query', description: 'Data per halaman (max: 100)', required: false, schema: new OA\Schema(type: 'integer', default: 15)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Berhasil mengambil data rumah.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $paginator = $this->houseService->getAll(
            filters: $request->only(['search', 'occupancy_status', 'sort']),
            perPage: (int) $request->input('per_page', 15),
        );

        return ApiResponse::paginated($paginator, HouseResource::class);
    }

    #[OA\Post(
        path: '/houses',
        summary: 'Tambah rumah baru',
        description: 'Tambah rumah. Status awal: tidak_dihuni. Nomor rumah harus unik.',
        security: [['bearerAuth' => []]],
        tags: ['Houses'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['house_number'],
                properties: [
                    new OA\Property(property: 'house_number', type: 'string', maxLength: 50, example: 'A-01', description: 'Nomor rumah (unik)'),
                ],
                type: 'object'
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Rumah berhasil ditambahkan.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 422, description: 'Validasi gagal (nomor rumah sudah terdaftar).'),
        ]
    )]
    public function store(StoreHouseRequest $request): JsonResponse
    {
        $house = $this->houseService->create($request->validated());

        return ApiResponse::success(
            new HouseResource($house),
            'Rumah berhasil ditambahkan',
            201
        );
    }

    #[OA\Get(
        path: '/houses/{id}',
        summary: 'Detail rumah dengan penghuni aktif',
        description: 'Detail rumah termasuk info penghuni aktif (jika ada).',
        security: [['bearerAuth' => []]],
        tags: ['Houses'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID rumah', schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Data rumah berhasil diambil.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 404, description: 'Rumah tidak ditemukan.'),
        ]
    )]
    public function show(int $id): JsonResponse
    {
        $house = $this->houseService->findById($id);
        $house->load('activeOccupancy.resident');

        return ApiResponse::success(
            new HouseDetailResource($house),
            'Data rumah berhasil diambil'
        );
    }

    #[OA\Put(
        path: '/houses/{id}',
        summary: 'Update data rumah',
        description: 'Update data rumah. Nomor rumah unik (ignore current).',
        security: [['bearerAuth' => []]],
        tags: ['Houses'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID rumah', schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['house_number'],
                properties: [
                    new OA\Property(property: 'house_number', type: 'string', maxLength: 50, example: 'A-01'),
                ],
                type: 'object'
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Data rumah berhasil diperbarui.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 404, description: 'Rumah tidak ditemukan.'),
            new OA\Response(response: 422, description: 'Validasi gagal.'),
        ]
    )]
    public function update(UpdateHouseRequest $request, int $id): JsonResponse
    {
        $house = $this->houseService->update($id, $request->validated());

        return ApiResponse::success(
            new HouseResource($house),
            'Data rumah berhasil diperbarui'
        );
    }

    #[OA\Patch(
        path: '/houses/{id}/deactivate',
        summary: 'Nonaktifkan rumah (soft delete)',
        description: 'Nonaktifkan rumah. Hanya jika tidak sedang dihuni.',
        security: [['bearerAuth' => []]],
        tags: ['Houses'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID rumah', schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Rumah berhasil dinonaktifkan.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 404, description: 'Rumah tidak ditemukan.'),
            new OA\Response(response: 409, description: 'Konflik - rumah masih dihuni.'),
        ]
    )]
    public function deactivate(int $id): JsonResponse
    {
        $this->houseService->deactivate($id);

        return ApiResponse::success(null, 'Rumah berhasil dinonaktifkan');
    }

    #[OA\Get(
        path: '/houses/{id}/occupancy-history',
        summary: 'Riwayat penghuni rumah',
        description: 'Seluruh riwayat hunian rumah, diurutkan dari terbaru.',
        security: [['bearerAuth' => []]],
        tags: ['Houses'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID rumah', schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Riwayat penghuni berhasil diambil.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 404, description: 'Rumah tidak ditemukan.'),
        ]
    )]
    public function occupancyHistory(int $id): JsonResponse
    {
        $history = $this->occupancyService->getHistoryByHouseId($id);

        return ApiResponse::success(
            OccupancyResource::collection($history),
            'Riwayat penghuni berhasil diambil'
        );
    }

    #[OA\Get(
        path: '/houses/{id}/payment-history',
        summary: 'Riwayat pembayaran rumah',
        description: 'Riwayat pembayaran iuran rumah. Filter berdasarkan jenis iuran dan tahun.',
        security: [['bearerAuth' => []]],
        tags: ['Houses'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID rumah', schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'dues_type_id', in: 'query', description: 'Filter jenis iuran', required: false, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'year', in: 'query', description: 'Filter tahun', required: false, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Riwayat pembayaran berhasil diambil.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
        ]
    )]
    public function paymentHistory(Request $request, int $id): JsonResponse
    {
        $payments = $this->paymentService->getByHouseId($id, $request->only(['dues_type_id', 'year']));

        return ApiResponse::success(
            PaymentResource::collection($payments),
            'Riwayat pembayaran berhasil diambil'
        );
    }

    #[OA\Post(
        path: '/houses/{id}/assign-resident',
        summary: 'Tempatkan penghuni di rumah',
        description: 'Menempatkan penghuni ke rumah kosong. Validasi: rumah belum dihuni, penghuni belum aktif di rumah lain.',
        security: [['bearerAuth' => []]],
        tags: ['Houses'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID rumah', schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['resident_id'],
                properties: [
                    new OA\Property(property: 'resident_id', type: 'integer', example: 1, description: 'ID penghuni'),
                ],
                type: 'object'
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Penghuni berhasil ditempatkan.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 404, description: 'Rumah/penghuni tidak ditemukan.'),
            new OA\Response(response: 409, description: 'Konflik - rumah sudah dihuni / penghuni sudah aktif.'),
            new OA\Response(response: 422, description: 'Validasi gagal.'),
        ]
    )]
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

    #[OA\Post(
        path: '/houses/{id}/reassign-resident',
        summary: 'Ganti penghuni rumah',
        description: 'Menutup occupancy lama dan membuat occupancy baru untuk penghuni baru.',
        security: [['bearerAuth' => []]],
        tags: ['Houses'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID rumah', schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['resident_id'],
                properties: [
                    new OA\Property(property: 'resident_id', type: 'integer', example: 1, description: 'ID penghuni baru'),
                ],
                type: 'object'
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Penghuni berhasil dipindahkan.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 404, description: 'Rumah/penghuni tidak ditemukan.'),
            new OA\Response(response: 409, description: 'Konflik - penghuni baru sudah aktif di rumah lain.'),
            new OA\Response(response: 422, description: 'Validasi gagal.'),
        ]
    )]
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
