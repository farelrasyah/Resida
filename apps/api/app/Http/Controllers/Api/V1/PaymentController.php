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

class PaymentController extends Controller
{
    public function __construct(
        private readonly PaymentService $paymentService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->paymentService->getAll(
            filters: $request->only(['house_id', 'resident_id', 'dues_type_id', 'status', 'year', 'month']),
            perPage: (int) $request->input('per_page', 15),
        );

        return ApiResponse::paginated($paginator, PaymentResource::class);
    }

    public function store(StorePaymentRequest $request): JsonResponse
    {
        $payment = $this->paymentService->createPayment($request->validated());

        return ApiResponse::success(
            new PaymentResource($payment),
            'Pembayaran berhasil dicatat',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $payment = $this->paymentService->findById($id);

        return ApiResponse::success(
            new PaymentResource($payment),
            'Data pembayaran berhasil diambil'
        );
    }

    public function cancel(int $id): JsonResponse
    {
        $payment = $this->paymentService->cancelPayment($id);

        return ApiResponse::success(
            new PaymentResource($payment),
            'Pembayaran berhasil dibatalkan'
        );
    }
}
