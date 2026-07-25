<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Expense;
use App\Repositories\Contracts\ExpenseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ExpenseRepository implements ExpenseRepositoryInterface
{
    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Expense::query();

        if (! empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (! empty($filters['year'])) {
            $query->whereYear('expense_date', $filters['year']);
        }

        if (! empty($filters['month'])) {
            $query->whereMonth('expense_date', $filters['month']);
        }

        $query->latest('expense_date');

        return $query->paginate(min($perPage, 100));
    }

    public function findById(int $id): ?Expense
    {
        return Expense::find($id);
    }

    public function findByIdOrFail(int $id): Expense
    {
        $expense = Expense::find($id);

        if (! $expense) {
            throw new ModelNotFoundException("Expense with ID {$id} not found.");
        }

        return $expense;
    }

    public function create(array $data): Expense
    {
        return Expense::create($data);
    }

    public function update(Expense $expense, array $data): Expense
    {
        $expense->update($data);

        return $expense->fresh();
    }

    public function softDelete(Expense $expense): bool
    {
        return (bool) $expense->delete();
    }

    /**
     * Get monthly expense totals for a given year.
     *
     * @return array<int, float> month (1-12) => total amount
     */
    public function getMonthlyExpenses(int $year): array
    {
        $results = Expense::whereYear('expense_date', $year)
            ->select(
                DB::raw('MONTH(expense_date) as month'),
                DB::raw('SUM(amount) as total')
            )
            ->groupBy(DB::raw('MONTH(expense_date)'))
            ->get();

        $monthly = array_fill(1, 12, 0.0);
        foreach ($results as $row) {
            $monthly[(int) $row->month] = (float) $row->total;
        }

        return $monthly;
    }

    /**
     * Get total expenses before a given year.
     */
    public function getExpenseBeforeYear(int $year): float
    {
        return (float) Expense::where('expense_date', '<', "{$year}-01-01")->sum('amount');
    }

    /**
     * Get all expenses for a specific month.
     */
    public function getExpensesForMonth(int $year, int $month): Collection
    {
        return Expense::whereYear('expense_date', $year)
            ->whereMonth('expense_date', $month)
            ->orderByDesc('expense_date')
            ->get();
    }
}
