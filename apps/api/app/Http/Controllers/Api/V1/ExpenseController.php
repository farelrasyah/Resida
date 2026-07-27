<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Expense\StoreExpenseRequest;
use App\Http\Requests\V1\Expense\UpdateExpenseRequest;
use App\Http\Resources\V1\ExpenseResource;
use App\Services\ExpenseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ExpenseController extends Controller
{
    public function __construct(
        private readonly ExpenseService $expenseService,
    ) {}

    #[OA\Get(
        path: '/expenses',
        summary: 'Daftar pengeluaran (paginasi)',
        description: 'Daftar pengeluaran kas. Filter: kategori, tahun, bulan.',
        security: [['bearerAuth' => []]],
        tags: ['Expenses'],
        parameters: [
            new OA\Parameter(name: 'category', in: 'query', description: 'Filter kategori', required: false, schema: new OA\Schema(type: 'string', enum: ['gaji_satpam', 'listrik_utilitas', 'kebersihan', 'perbaikan', 'lainnya'])),
            new OA\Parameter(name: 'year', in: 'query', description: 'Filter tahun', required: false, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'month', in: 'query', description: 'Filter bulan (1-12)', required: false, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'page', in: 'query', description: 'Halaman', required: false, schema: new OA\Schema(type: 'integer', default: 1)),
            new OA\Parameter(name: 'per_page', in: 'query', description: 'Data per halaman (max: 100)', required: false, schema: new OA\Schema(type: 'integer', default: 15)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Berhasil mengambil data pengeluaran.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $paginator = $this->expenseService->getAll(
            filters: $request->only(['category', 'year', 'month']),
            perPage: (int) $request->input('per_page', 15),
        );

        return ApiResponse::paginated($paginator, ExpenseResource::class);
    }

    #[OA\Post(
        path: '/expenses',
        summary: 'Tambah pengeluaran baru',
        description: 'Mencatat pengeluaran kas baru.',
        security: [['bearerAuth' => []]],
        tags: ['Expenses'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['category', 'description', 'amount', 'expense_date'],
                properties: [
                    new OA\Property(property: 'category', type: 'string', enum: ['gaji_satpam', 'listrik_utilitas', 'kebersihan', 'perbaikan', 'lainnya'], example: 'listrik_utilitas'),
                    new OA\Property(property: 'description', type: 'string', maxLength: 255, example: 'Bayar listrik Jan 2026'),
                    new OA\Property(property: 'amount', type: 'number', format: 'float', example: 500000.00, description: 'Harus > 0'),
                    new OA\Property(property: 'expense_date', type: 'string', format: 'date', example: '2026-01-10'),
                ],
                type: 'object'
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Pengeluaran berhasil ditambahkan.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 422, description: 'Validasi gagal.'),
        ]
    )]
    public function store(StoreExpenseRequest $request): JsonResponse
    {
        $expense = $this->expenseService->create($request->validated());

        return ApiResponse::success(
            new ExpenseResource($expense),
            'Pengeluaran berhasil ditambahkan',
            201
        );
    }

    #[OA\Get(
        path: '/expenses/{id}',
        summary: 'Detail pengeluaran',
        description: 'Detail pengeluaran berdasarkan ID.',
        security: [['bearerAuth' => []]],
        tags: ['Expenses'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID pengeluaran', schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Data pengeluaran berhasil diambil.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 404, description: 'Pengeluaran tidak ditemukan.'),
        ]
    )]
    public function show(int $id): JsonResponse
    {
        $expense = $this->expenseService->findById($id);

        return ApiResponse::success(
            new ExpenseResource($expense),
            'Data pengeluaran berhasil diambil'
        );
    }

    #[OA\Put(
        path: '/expenses/{id}',
        summary: 'Update pengeluaran',
        description: 'Update data pengeluaran.',
        security: [['bearerAuth' => []]],
        tags: ['Expenses'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID pengeluaran', schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['category', 'description', 'amount', 'expense_date'],
                properties: [
                    new OA\Property(property: 'category', type: 'string', enum: ['gaji_satpam', 'listrik_utilitas', 'kebersihan', 'perbaikan', 'lainnya'], example: 'listrik_utilitas'),
                    new OA\Property(property: 'description', type: 'string', maxLength: 255, example: 'Bayar listrik Jan 2026'),
                    new OA\Property(property: 'amount', type: 'number', format: 'float', example: 500000.00),
                    new OA\Property(property: 'expense_date', type: 'string', format: 'date', example: '2026-01-10'),
                ],
                type: 'object'
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Data pengeluaran berhasil diperbarui.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 404, description: 'Pengeluaran tidak ditemukan.'),
            new OA\Response(response: 422, description: 'Validasi gagal.'),
        ]
    )]
    public function update(UpdateExpenseRequest $request, int $id): JsonResponse
    {
        $expense = $this->expenseService->update($id, $request->validated());

        return ApiResponse::success(
            new ExpenseResource($expense),
            'Data pengeluaran berhasil diperbarui'
        );
    }

    #[OA\Patch(
        path: '/expenses/{id}/deactivate',
        summary: 'Nonaktifkan pengeluaran (soft delete)',
        description: 'Nonaktifkan pengeluaran (soft delete). Data tetap tersimpan.',
        security: [['bearerAuth' => []]],
        tags: ['Expenses'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID pengeluaran', schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Pengeluaran berhasil dinonaktifkan.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 404, description: 'Pengeluaran tidak ditemukan.'),
        ]
    )]
    public function deactivate(int $id): JsonResponse
    {
        $this->expenseService->deactivate($id);

        return ApiResponse::success(null, 'Pengeluaran berhasil dinonaktifkan');
    }
}
