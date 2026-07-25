<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Expense;
use App\Repositories\Contracts\ExpenseRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class ExpenseService
{
    public function __construct(
        private readonly ExpenseRepositoryInterface $expenseRepository,
    ) {}

    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->expenseRepository->getAll($filters, $perPage);
    }

    public function findById(int $id): Expense
    {
        return $this->expenseRepository->findByIdOrFail($id);
    }

    public function create(array $data): Expense
    {
        return $this->expenseRepository->create($data);
    }

    public function update(int $id, array $data): Expense
    {
        $expense = $this->expenseRepository->findByIdOrFail($id);

        return $this->expenseRepository->update($expense, $data);
    }

    /**
     * Soft-delete an expense.
     */
    public function deactivate(int $id): void
    {
        $expense = $this->expenseRepository->findByIdOrFail($id);

        $this->expenseRepository->softDelete($expense);
    }
}
