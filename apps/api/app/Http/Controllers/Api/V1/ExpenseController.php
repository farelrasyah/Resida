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

class ExpenseController extends Controller
{
    public function __construct(
        private readonly ExpenseService $expenseService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->expenseService->getAll(
            filters: $request->only(['category', 'year', 'month']),
            perPage: (int) $request->input('per_page', 15),
        );

        return ApiResponse::paginated($paginator, ExpenseResource::class);
    }

    public function store(StoreExpenseRequest $request): JsonResponse
    {
        $expense = $this->expenseService->create($request->validated());

        return ApiResponse::success(
            new ExpenseResource($expense),
            'Pengeluaran berhasil ditambahkan',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $expense = $this->expenseService->findById($id);

        return ApiResponse::success(
            new ExpenseResource($expense),
            'Data pengeluaran berhasil diambil'
        );
    }

    public function update(UpdateExpenseRequest $request, int $id): JsonResponse
    {
        $expense = $this->expenseService->update($id, $request->validated());

        return ApiResponse::success(
            new ExpenseResource($expense),
            'Data pengeluaran berhasil diperbarui'
        );
    }

    public function deactivate(int $id): JsonResponse
    {
        $this->expenseService->deactivate($id);

        return ApiResponse::success(null, 'Pengeluaran berhasil dinonaktifkan');
    }
}
