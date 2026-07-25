<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct(
        private readonly ReportService $reportService,
    ) {}

    /**
     * Annual summary report with cumulative balance.
     */
    public function summary(Request $request): JsonResponse
    {
        $year = (int) $request->input('year', now()->year);
        $data = $this->reportService->getAnnualSummary($year);

        return ApiResponse::success($data, 'Laporan ringkasan tahunan berhasil diambil');
    }

    /**
     * Monthly detail report.
     */
    public function detail(Request $request): JsonResponse
    {
        $year = (int) $request->input('year', now()->year);
        $month = (int) $request->input('month', now()->month);
        $data = $this->reportService->getMonthlyDetail($year, $month);

        return ApiResponse::success($data, 'Laporan detail bulanan berhasil diambil');
    }

    /**
     * Dashboard summary (lightweight aggregate).
     */
    public function dashboard(): JsonResponse
    {
        $data = $this->reportService->getDashboard();

        return ApiResponse::success($data, 'Data dashboard berhasil diambil');
    }
}
