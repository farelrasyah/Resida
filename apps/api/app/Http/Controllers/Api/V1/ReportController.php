<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ReportController extends Controller
{
    public function __construct(
        private readonly ReportService $reportService,
    ) {}

    #[OA\Get(
        path: '/reports/summary',
        summary: 'Laporan ringkasan tahunan',
        description: 'Laporan keuangan tahunan: saldo awal, pendapatan, pengeluaran, saldo kumulatif per bulan.',
        security: [['bearerAuth' => []]],
        tags: ['Reports'],
        parameters: [
            new OA\Parameter(name: 'year', in: 'query', description: 'Tahun (default: tahun berjalan)', required: false, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Laporan ringkasan tahunan berhasil diambil.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
        ]
    )]
    public function summary(Request $request): JsonResponse
    {
        $year = (int) $request->input('year', now()->year);
        $data = $this->reportService->getAnnualSummary($year);

        return ApiResponse::success($data, 'Laporan ringkasan tahunan berhasil diambil');
    }

    #[OA\Get(
        path: '/reports/detail',
        summary: 'Laporan detail bulanan',
        description: 'Laporan detail bulanan: pembayaran, pengeluaran, status tagihan per rumah (Lunas/Belum Lunas/Tidak Ada Tagihan).',
        security: [['bearerAuth' => []]],
        tags: ['Reports'],
        parameters: [
            new OA\Parameter(name: 'year', in: 'query', description: 'Tahun (default: tahun berjalan)', required: false, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'month', in: 'query', description: 'Bulan 1-12 (default: bulan berjalan)', required: false, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Laporan detail bulanan berhasil diambil.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
        ]
    )]
    public function detail(Request $request): JsonResponse
    {
        $year = (int) $request->input('year', now()->year);
        $month = (int) $request->input('month', now()->month);
        $data = $this->reportService->getMonthlyDetail($year, $month);

        return ApiResponse::success($data, 'Laporan detail bulanan berhasil diambil');
    }

    #[OA\Get(
        path: '/reports/dashboard',
        summary: 'Data dashboard',
        description: 'Ringkasan dashboard: total rumah, terisi/kosong, pendapatan/pengeluaran bulan ini, saldo terkini.',
        security: [['bearerAuth' => []]],
        tags: ['Reports'],
        responses: [
            new OA\Response(response: 200, description: 'Data dashboard berhasil diambil.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
        ]
    )]
    public function dashboard(): JsonResponse
    {
        $data = $this->reportService->getDashboard();

        return ApiResponse::success($data, 'Data dashboard berhasil diambil');
    }
}
