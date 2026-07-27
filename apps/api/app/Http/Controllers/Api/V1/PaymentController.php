<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Payment\StorePaymentRequest;
use App\Http\Resources\V1\PaymentResource;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class PaymentController extends Controller
{
    public function __construct(
        private readonly PaymentService $paymentService,
    ) {}

    #[OA\Get(
        path: '/payments',
        summary: 'Daftar pembayaran (paginasi)',
        description: 'Daftar pembayaran iuran. Filter: rumah, penghuni, jenis iuran, status, tahun, bulan.',
        security: [['bearerAuth' => []]],
        tags: ['Payments'],
        parameters: [
            new OA\Parameter(name: 'house_id', in: 'query', description: 'Filter ID rumah', required: false, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'resident_id', in: 'query', description: 'Filter ID penghuni', required: false, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'dues_type_id', in: 'query', description: 'Filter jenis iuran', required: false, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'status', in: 'query', description: 'Filter status', required: false, schema: new OA\Schema(type: 'string', enum: ['lunas', 'dibatalkan'])),
            new OA\Parameter(name: 'year', in: 'query', description: 'Filter tahun', required: false, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'month', in: 'query', description: 'Filter bulan (1-12)', required: false, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'page', in: 'query', description: 'Halaman', required: false, schema: new OA\Schema(type: 'integer', default: 1)),
            new OA\Parameter(name: 'per_page', in: 'query', description: 'Data per halaman (max: 100)', required: false, schema: new OA\Schema(type: 'integer', default: 15)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Berhasil mengambil data pembayaran.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $paginator = $this->paymentService->getAll(
            filters: $request->only(['house_id', 'resident_id', 'dues_type_id', 'status', 'year', 'month']),
            perPage: (int) $request->input('per_page', 15),
        );

        return ApiResponse::paginated($paginator, PaymentResource::class);
    }

    #[OA\Post(
        path: '/payments',
        summary: 'Catat pembayaran baru',
        description: 'Mencatat pembayaran iuran. Amount di-snapshot dari dues_type. Otomatis breakdown ke N periode. Rumah harus memiliki penghuni aktif. Periode lunas tidak bisa dibayar ulang.',
        security: [['bearerAuth' => []]],
        tags: ['Payments'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['house_id', 'dues_type_id', 'period_start_year', 'period_start_month', 'payment_date'],
                properties: [
                    new OA\Property(property: 'house_id', type: 'integer', example: 1, description: 'ID rumah'),
                    new OA\Property(property: 'dues_type_id', type: 'integer', example: 1, description: 'ID jenis iuran'),
                    new OA\Property(property: 'period_start_year', type: 'integer', minimum: 2000, maximum: 2100, example: 2026, description: 'Tahun awal periode'),
                    new OA\Property(property: 'period_start_month', type: 'integer', minimum: 1, maximum: 12, example: 1, description: 'Bulan awal periode'),
                    new OA\Property(property: 'period_count', type: 'integer', minimum: 1, maximum: 12, example: 3, default: 1, description: 'Jumlah periode (default: 1)'),
                    new OA\Property(property: 'payment_date', type: 'string', format: 'date', example: '2026-01-15'),
                    new OA\Property(property: 'notes', type: 'string', maxLength: 255, nullable: true, example: 'Bayar iuran Jan-Mar 2026'),
                ],
                type: 'object'
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Pembayaran berhasil dicatat.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 409, description: 'Konflik - rumah tidak berpenghuni / periode sudah lunas.'),
            new OA\Response(response: 422, description: 'Validasi gagal.'),
        ]
    )]
    public function store(StorePaymentRequest $request): JsonResponse
    {
        $payment = $this->paymentService->createPayment($request->validated());

        return ApiResponse::success(
            new PaymentResource($payment),
            'Pembayaran berhasil dicatat',
            201
        );
    }

    #[OA\Get(
        path: '/payments/{id}',
        summary: 'Detail pembayaran',
        description: 'Detail pembayaran termasuk rumah, penghuni, jenis iuran, dan periode.',
        security: [['bearerAuth' => []]],
        tags: ['Payments'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID pembayaran', schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Data pembayaran berhasil diambil.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 404, description: 'Pembayaran tidak ditemukan.'),
        ]
    )]
    public function show(int $id): JsonResponse
    {
        $payment = $this->paymentService->findById($id);

        return ApiResponse::success(
            new PaymentResource($payment),
            'Data pembayaran berhasil diambil'
        );
    }

    #[OA\Patch(
        path: '/payments/{id}/cancel',
        summary: 'Batalkan pembayaran',
        description: 'Membatalkan pembayaran (status → dibatalkan). Data periode tetap tersimpan. Pembayaran yang sudah dibatalkan tidak bisa dibatalkan lagi.',
        security: [['bearerAuth' => []]],
        tags: ['Payments'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID pembayaran', schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Pembayaran berhasil dibatalkan.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 404, description: 'Pembayaran tidak ditemukan.'),
            new OA\Response(response: 409, description: 'Konflik - pembayaran sudah dibatalkan.'),
        ]
    )]
    public function cancel(int $id): JsonResponse
    {
        $payment = $this->paymentService->cancelPayment($id);

        return ApiResponse::success(
            new PaymentResource($payment),
            'Pembayaran berhasil dibatalkan'
        );
    }
}
