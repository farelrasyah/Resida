<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\ExpenseCategory;
use App\Enums\PaymentStatus;
use App\Models\DuesType;
use App\Models\Payment;
use App\Models\Expense;
use App\Models\Resident;
use App\Models\House;
use App\Models\PaymentPeriod;
use App\Repositories\Contracts\ExpenseRepositoryInterface;
use App\Repositories\Contracts\HouseRepositoryInterface;
use App\Repositories\Contracts\PaymentPeriodRepositoryInterface;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use Illuminate\Support\Facades\DB;

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

    public function getDashboard(): array
    {
        $currentYear = (int) now()->year;
        $currentMonth = (int) now()->month;
        $lastMonthDate = now()->subMonth();
        $lastMonthYear = (int) $lastMonthDate->year;
        $lastMonth = (int) $lastMonthDate->month;

        // --- KPIs ---
        $houseCounts = $this->houseRepository->countByStatus();
        
        $totalResidents = Resident::count();
        $totalResidentsLastMonth = Resident::where('created_at', '<', now()->startOfMonth())->count();

        $monthlyIncomeCurrent = $this->paymentRepository->getMonthlyIncomeByPeriods($currentYear);
        $monthlyIncomeLastMonth = $lastMonthYear === $currentYear 
            ? ($monthlyIncomeCurrent[$lastMonth] ?? 0.0) 
            : ($this->paymentRepository->getMonthlyIncomeByPeriods($lastMonthYear)[$lastMonth] ?? 0.0);
            
        $monthlyExpenseCurrent = $this->expenseRepository->getMonthlyExpenses($currentYear);
        $monthlyExpenseLastMonth = $lastMonthYear === $currentYear 
            ? ($monthlyExpenseCurrent[$lastMonth] ?? 0.0) 
            : ($this->expenseRepository->getMonthlyExpenses($lastMonthYear)[$lastMonth] ?? 0.0);

        // Calculate current balance
        $incomeBeforeYear = $this->paymentRepository->getIncomeBeforeYear($currentYear);
        $expenseBeforeYear = $this->expenseRepository->getExpenseBeforeYear($currentYear);
        $startingBalance = $incomeBeforeYear - $expenseBeforeYear;
        $currentBalance = $startingBalance;
        for ($m = 1; $m <= $currentMonth; $m++) {
            $currentBalance += ($monthlyIncomeCurrent[$m] ?? 0.0) - ($monthlyExpenseCurrent[$m] ?? 0.0);
        }

        // Paid vs Unpaid Dues count for current month
        $totalOccupiedHouses = $houseCounts['occupied'];
        $duesTypesCount = DuesType::count();
        $expectedPeriods = $totalOccupiedHouses * $duesTypesCount;
        $paidPeriodsCount = PaymentPeriod::where('period_year', $currentYear)
            ->where('period_month', $currentMonth)
            ->whereHas('payment', fn($q) => $q->where('status', PaymentStatus::Lunas->value))
            ->count();
        $unpaidPeriodsCount = max(0, $expectedPeriods - $paidPeriodsCount);

        // --- Charts Data ---
        // Cash Flow Chart (12 months of current year)
        $cashFlowChart = [];
        $runningBalance = $startingBalance;
        for ($m = 1; $m <= 12; $m++) {
            $inc = $monthlyIncomeCurrent[$m] ?? 0.0;
            $exp = $monthlyExpenseCurrent[$m] ?? 0.0;
            $runningBalance += $inc - $exp;
            $cashFlowChart[] = [
                'month' => date('M', mktime(0, 0, 0, $m, 1)),
                'income' => $inc,
                'expense' => $exp,
                'balance' => $m <= $currentMonth ? $runningBalance : null,
            ];
        }

        // Expense Categories
        $expenseCategories = Expense::select('category', DB::raw('SUM(amount) as total'))
            ->whereYear('expense_date', $currentYear)
            ->whereMonth('expense_date', $currentMonth)
            ->groupBy('category')
            ->get()
            ->map(fn($e) => [
                'name' => $this->getCategoryLabel($e->category),
                'value' => (float) $e->total,
                'color' => $this->getCategoryColor($this->getCategoryLabel($e->category))
            ]);

        // House Composition
        $houseComposition = [
            ['name' => 'Terisi', 'value' => $houseCounts['occupied'], 'color' => '#3b82f6'],
            ['name' => 'Kosong', 'value' => $houseCounts['vacant'], 'color' => '#ef4444'],
        ];

        // --- Widgets Data ---
        $latestPayments = Payment::with(['house'])
            ->where('status', PaymentStatus::Lunas->value)
            ->orderByDesc('payment_date')
            ->orderByDesc('id')
            ->limit(5)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'date' => $p->payment_date->format('Y-m-d'),
                'house' => $p->house->house_number ?? '-',
                'amount' => (float) $p->amount,
                'method' => 'Tunai',
                'admin' => '-',
            ]);

        $latestExpenses = Expense::orderByDesc('expense_date')
            ->orderByDesc('id')
            ->limit(5)
            ->get()
            ->map(fn($e) => [
                'id' => $e->id,
                'date' => $e->expense_date->format('Y-m-d'),
                'title' => $e->description,
                'category' => $this->getCategoryLabel($e->category),
                'amount' => (float) $e->amount,
            ]);

        $topDefaulters = House::where('occupancy_status', 'occupied')
            ->get()
            ->map(function ($house) use ($currentYear, $currentMonth, $duesTypesCount) {
                // Approximate unpaid by checking how many periods they paid this year vs expected
                $paidThisYear = PaymentPeriod::where('house_id', $house->id)
                    ->where('period_year', $currentYear)
                    ->where('period_month', '<=', $currentMonth)
                    ->whereHas('payment', fn($q) => $q->where('status', PaymentStatus::Lunas->value))
                    ->count();
                $expected = $currentMonth * $duesTypesCount;
                $unpaid = max(0, $expected - $paidThisYear);
                return [
                    'house_number' => $house->house_number,
                    'unpaid_count' => $unpaid,
                    'resident' => $house->activeOccupancy->resident->full_name ?? '-',
                ];
            })
            ->filter(fn($h) => $h['unpaid_count'] > 0)
            ->sortByDesc('unpaid_count')
            ->values()
            ->take(5);

        // Mix recent activities
        $activities = collect([]);
        foreach ($latestPayments as $p) {
            $activities->push([
                'type' => 'payment',
                'title' => "Pembayaran Iuran: {$p['house']}",
                'subtitle' => "Rp " . number_format($p['amount'], 0, ',', '.'),
                'date' => $p['date']
            ]);
        }
        foreach ($latestExpenses as $e) {
            $activities->push([
                'type' => 'expense',
                'title' => "Pengeluaran: {$e['title']}",
                'subtitle' => "Rp " . number_format($e['amount'], 0, ',', '.'),
                'date' => $e['date']
            ]);
        }
        
        return [
            'kpis' => [
                'total_houses' => $houseCounts['total'],
                'occupied_houses' => $houseCounts['occupied'],
                'vacant_houses' => $houseCounts['vacant'],
                'total_residents' => $totalResidents,
                'total_residents_last_month' => $totalResidentsLastMonth,
                'current_month_income' => $monthlyIncomeCurrent[$currentMonth] ?? 0.0,
                'last_month_income' => $monthlyIncomeLastMonth,
                'current_month_expense' => $monthlyExpenseCurrent[$currentMonth] ?? 0.0,
                'last_month_expense' => $monthlyExpenseLastMonth,
                'current_balance' => $currentBalance,
                'unpaid_periods' => $unpaidPeriodsCount,
                'paid_periods' => $paidPeriodsCount,
                'expected_periods' => $expectedPeriods,
            ],
            'charts' => [
                'cash_flow' => $cashFlowChart,
                'expense_categories' => $expenseCategories,
                'house_composition' => $houseComposition,
            ],
            'widgets' => [
                'latest_payments' => $latestPayments,
                'latest_expenses' => $latestExpenses,
                'top_defaulters' => $topDefaulters,
                'recent_activities' => $activities->sortByDesc('date')->values()->take(10),
            ]
        ];
    }

    private function getCategoryLabel(ExpenseCategory $category): string
    {
        return match ($category) {
            ExpenseCategory::GajiSatpam => 'Keamanan',
            ExpenseCategory::Kebersihan => 'Kebersihan',
            ExpenseCategory::ListrikUtilitas => 'Listrik & Air',
            ExpenseCategory::Perbaikan => 'Perbaikan',
            ExpenseCategory::Lainnya => 'Operasional',
        };
    }

    private function getCategoryColor(string $categoryName): string
    {
        $colors = [
            'Keamanan' => '#3b82f6',
            'Kebersihan' => '#10b981',
            'Sosial' => '#f59e0b',
            'Perbaikan' => '#ef4444',
            'Operasional' => '#8b5cf6',
            'Listrik & Air' => '#06b6d4',
            'Event/Acara' => '#ec4899',
        ];
        
        return $colors[$categoryName] ?? '#94a3b8';
    }
}
