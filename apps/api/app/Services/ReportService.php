<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\PaymentStatus;
use App\Models\DuesType;
use App\Repositories\Contracts\ExpenseRepositoryInterface;
use App\Repositories\Contracts\HouseRepositoryInterface;
use App\Repositories\Contracts\PaymentPeriodRepositoryInterface;
use App\Repositories\Contracts\PaymentRepositoryInterface;

class ReportService
{
    public function __construct(
        private readonly PaymentRepositoryInterface $paymentRepository,
        private readonly PaymentPeriodRepositoryInterface $paymentPeriodRepository,
        private readonly ExpenseRepositoryInterface $expenseRepository,
        private readonly HouseRepositoryInterface $houseRepository,
    ) {}

    /**
     * Get annual summary report with cumulative balance (BR-20).
     *
     * @return array{year: int, starting_balance: float, months: array}
     */
    public function getAnnualSummary(int $year): array
    {
        // Saldo awal = total income before year - total expense before year
        $incomeBeforeYear = $this->paymentRepository->getIncomeBeforeYear($year);
        $expenseBeforeYear = $this->expenseRepository->getExpenseBeforeYear($year);
        $startingBalance = $incomeBeforeYear - $expenseBeforeYear;

        // Monthly aggregates
        $monthlyIncome = $this->paymentRepository->getMonthlyIncomeByPeriods($year);
        $monthlyExpense = $this->expenseRepository->getMonthlyExpenses($year);

        $months = [];
        $runningBalance = $startingBalance;

        for ($m = 1; $m <= 12; $m++) {
            $income = $monthlyIncome[$m] ?? 0.0;
            $expense = $monthlyExpense[$m] ?? 0.0;
            $runningBalance += $income - $expense;

            $months[] = [
                'month' => $m,
                'income' => $income,
                'expense' => $expense,
                'balance' => $runningBalance,
            ];
        }

        return [
            'year' => $year,
            'starting_balance' => $startingBalance,
            'months' => $months,
        ];
    }

    /**
     * Get monthly detail report.
     *
     * BR-12: Houses without occupancy = "Tidak Ada Tagihan"
     * BR-19: Vacant houses still appear in report
     *
     * @return array{payments: array, expenses: array, house_statuses: array}
     */
    public function getMonthlyDetail(int $year, int $month): array
    {
        // Get all payment periods for this month (finalized only)
        $paymentPeriods = $this->paymentPeriodRepository->getPeriodsForMonth($year, $month);

        // Get all expenses for this month
        $expenses = $this->expenseRepository->getExpensesForMonth($year, $month);

        // Get all houses (BR-19: including vacant ones)
        $allHouses = $this->houseRepository->getAllWithoutPagination();
        $duesTypes = DuesType::all();

        // Build per-house status
        $houseStatuses = [];
        foreach ($allHouses as $house) {
            $paidPeriods = $this->paymentPeriodRepository->getPaidPeriodsForHouseInMonth(
                $house->id,
                $year,
                $month
            );

            $statusPerDues = [];
            foreach ($duesTypes as $duesType) {
                $isPaid = $paidPeriods->contains(fn ($p) => $p->dues_type_id === $duesType->id);

                // BR-12: If house has no active occupancy, show "Tidak Ada Tagihan"
                $hasOccupancy = $house->activeOccupancy !== null;

                if ($isPaid) {
                    $status = 'Lunas';
                } elseif (! $hasOccupancy) {
                    $status = 'Tidak Ada Tagihan';
                } else {
                    $status = 'Belum Lunas';
                }

                $statusPerDues[] = [
                    'dues_type_id' => $duesType->id,
                    'dues_type_name' => $duesType->name,
                    'status' => $status,
                ];
            }

            $houseStatuses[] = [
                'house_id' => $house->id,
                'house_number' => $house->house_number,
                'occupancy_status' => $house->occupancy_status->value,
                'dues_statuses' => $statusPerDues,
            ];
        }

        return [
            'year' => $year,
            'month' => $month,
            'payments' => $paymentPeriods,
            'expenses' => $expenses,
            'house_statuses' => $houseStatuses,
        ];
    }

    /**
     * Get dashboard summary (lightweight aggregate for landing page).
     *
     * @return array{total_houses: int, occupied_houses: int, vacant_houses: int, current_month_income: float, current_month_expense: float, current_balance: float}
     */
    public function getDashboard(): array
    {
        $houseCounts = $this->houseRepository->countByStatus();

        $currentYear = (int) now()->year;
        $currentMonth = (int) now()->month;

        $monthlyIncome = $this->paymentRepository->getMonthlyIncomeByPeriods($currentYear);
        $monthlyExpense = $this->expenseRepository->getMonthlyExpenses($currentYear);

        // Calculate current balance (all-time income - all-time expense up to current month)
        $incomeBeforeYear = $this->paymentRepository->getIncomeBeforeYear($currentYear);
        $expenseBeforeYear = $this->expenseRepository->getExpenseBeforeYear($currentYear);
        $startingBalance = $incomeBeforeYear - $expenseBeforeYear;

        $currentBalance = $startingBalance;
        for ($m = 1; $m <= $currentMonth; $m++) {
            $currentBalance += ($monthlyIncome[$m] ?? 0.0) - ($monthlyExpense[$m] ?? 0.0);
        }

        return [
            'total_houses' => $houseCounts['total'],
            'occupied_houses' => $houseCounts['occupied'],
            'vacant_houses' => $houseCounts['vacant'],
            'current_month_income' => $monthlyIncome[$currentMonth] ?? 0.0,
            'current_month_expense' => $monthlyExpense[$currentMonth] ?? 0.0,
            'current_balance' => $currentBalance,
        ];
    }
}
