<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Expense;
use Illuminate\Pagination\LengthAwarePaginator;

interface ExpenseRepositoryInterface
{
    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?Expense;

    public function findByIdOrFail(int $id): Expense;

    public function create(array $data): Expense;

    public function update(Expense $expense, array $data): Expense;

    public function softDelete(Expense $expense): bool;

    public function getMonthlyExpenses(int $year): array;

    public function getExpenseBeforeYear(int $year): float;

    public function getExpensesForMonth(int $year, int $month): \Illuminate\Database\Eloquent\Collection;
}
