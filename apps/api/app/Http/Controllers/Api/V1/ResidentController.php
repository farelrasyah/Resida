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
use OpenApi\Attributes as OA;

class ResidentController extends Controller
{
    public function __construct(
        private readonly ResidentService $residentService,
    ) {}

    #[OA\Get(
        path: '/residents',
        summary: 'Daftar penghuni (paginasi)',
        description: 'Mengembalikan daftar penghuni dengan paginasi. Mendukung pencarian (search), filter status hunian, dan sorting.',
        security: [['bearerAuth' => []]],
        tags: ['Residents'],
        parameters: [
            new OA\Parameter(name: 'search', in: 'query', description: 'Cari berdasarkan nama penghuni', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'resident_status', in: 'query', description: 'Filter status hunian (kontrak/tetap)', required: false, schema: new OA\Schema(type: 'string', enum: ['kontrak', 'tetap'])),
            new OA\Parameter(name: 'sort', in: 'query', description: 'Sorting. Prefix - untuk desc. Kolom: full_name, created_at, resident_status. Contoh: full_name, -created_at', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'page', in: 'query', description: 'Halaman', required: false, schema: new OA\Schema(type: 'integer', default: 1)),
            new OA\Parameter(name: 'per_page', in: 'query', description: 'Data per halaman (max: 100)', required: false, schema: new OA\Schema(type: 'integer', default: 15)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Berhasil mengambil data penghuni.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $paginator = $this->residentService->getAll(
            filters: $request->only(['search', 'resident_status', 'sort']),
            perPage: (int) $request->input('per_page', 15),
        );

        return ApiResponse::paginated($paginator, ResidentResource::class);
    }

    #[OA\Post(
        path: '/residents',
        summary: 'Tambah penghuni baru',
        description: 'Menambahkan data penghuni baru beserta upload foto KTP. Foto KTP wajib diisi.',
        security: [['bearerAuth' => []]],
        tags: ['Residents'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(
                    required: ['full_name', 'ktp_photo', 'resident_status', 'phone_number', 'marital_status'],
                    properties: [
                        new OA\Property(property: 'full_name', type: 'string', maxLength: 255, example: 'John Doe', description: 'Nama lengkap'),
                        new OA\Property(property: 'ktp_photo', type: 'string', format: 'binary', description: 'Foto KTP (JPG/JPEG/PNG, max 2MB)'),
                        new OA\Property(property: 'resident_status', type: 'string', enum: ['kontrak', 'tetap'], example: 'tetap'),
                        new OA\Property(property: 'phone_number', type: 'string', example: '081234567890', description: '10-15 digit angka'),
                        new OA\Property(property: 'marital_status', type: 'string', enum: ['sudah_menikah', 'belum_menikah'], example: 'belum_menikah'),
                    ],
                    type: 'object'
                )
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Penghuni berhasil ditambahkan.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 422, description: 'Validasi gagal.'),
        ]
    )]
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

    #[OA\Get(
        path: '/residents/{id}',
        summary: 'Detail penghuni',
        description: 'Detail penghuni berdasarkan ID, termasuk info rumah yang ditempati (jika ada).',
        security: [['bearerAuth' => []]],
        tags: ['Residents'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID penghuni', schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Data penghuni berhasil diambil.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 404, description: 'Penghuni tidak ditemukan.'),
        ]
    )]
    public function show(int $id): JsonResponse
    {
        $resident = $this->residentService->findById($id);

        return ApiResponse::success(
            new ResidentResource($resident),
            'Data penghuni berhasil diambil'
        );
    }

    #[OA\Put(
        path: '/residents/{id}',
        summary: 'Update data penghuni',
        description: 'Memperbarui data penghuni. Foto KTP opsional.',
        security: [['bearerAuth' => []]],
        tags: ['Residents'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID penghuni', schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(
                    required: ['full_name', 'resident_status', 'phone_number', 'marital_status'],
                    properties: [
                        new OA\Property(property: 'full_name', type: 'string', maxLength: 255, example: 'John Doe'),
                        new OA\Property(property: 'ktp_photo', type: 'string', format: 'binary', description: 'Foto KTP baru (opsional)'),
                        new OA\Property(property: 'resident_status', type: 'string', enum: ['kontrak', 'tetap'], example: 'tetap'),
                        new OA\Property(property: 'phone_number', type: 'string', example: '081234567890'),
                        new OA\Property(property: 'marital_status', type: 'string', enum: ['sudah_menikah', 'belum_menikah'], example: 'belum_menikah'),
                    ],
                    type: 'object'
                )
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Data penghuni berhasil diperbarui.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 404, description: 'Penghuni tidak ditemukan.'),
            new OA\Response(response: 422, description: 'Validasi gagal.'),
        ]
    )]
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

    #[OA\Patch(
        path: '/residents/{id}/deactivate',
        summary: 'Nonaktifkan penghuni (soft delete)',
        description: 'Nonaktifkan penghuni. Hanya bisa jika tidak memiliki hunian aktif.',
        security: [['bearerAuth' => []]],
        tags: ['Residents'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID penghuni', schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Penghuni berhasil dinonaktifkan.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 404, description: 'Penghuni tidak ditemukan.'),
            new OA\Response(response: 409, description: 'Konflik - penghuni masih memiliki hunian aktif.'),
        ]
    )]
    public function deactivate(int $id): JsonResponse
    {
        $this->residentService->deactivate($id);

        return ApiResponse::success(null, 'Penghuni berhasil dinonaktifkan');
    }
}
