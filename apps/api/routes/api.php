<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DuesTypeController;
use App\Http\Controllers\Api\V1\ExpenseController;
use App\Http\Controllers\Api\V1\HouseController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\ResidentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Version 1
|--------------------------------------------------------------------------
| Base prefix: /api/v1
| All routes except login require auth:sanctum middleware.
*/

Route::prefix('v1')->group(function () {
    // Health check (public)
    Route::get('/health', fn () => response()->json([
        'success' => true,
        'message' => 'RESIDA API is running.',
        'version' => 'v1',
    ]));

    // Auth (public)
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Residents
        Route::get('/residents', [ResidentController::class, 'index']);
        Route::post('/residents', [ResidentController::class, 'store']);
        Route::get('/residents/{id}', [ResidentController::class, 'show'])->whereNumber('id');
        Route::put('/residents/{id}', [ResidentController::class, 'update'])->whereNumber('id');
        Route::patch('/residents/{id}/deactivate', [ResidentController::class, 'deactivate'])->whereNumber('id');

        // Houses
        Route::get('/houses', [HouseController::class, 'index']);
        Route::post('/houses', [HouseController::class, 'store']);
        Route::get('/houses/{id}', [HouseController::class, 'show'])->whereNumber('id');
        Route::put('/houses/{house}', [HouseController::class, 'update'])->whereNumber('house');
        Route::patch('/houses/{id}/deactivate', [HouseController::class, 'deactivate'])->whereNumber('id');
        Route::get('/houses/{id}/occupancy-history', [HouseController::class, 'occupancyHistory'])->whereNumber('id');
        Route::get('/houses/{id}/payment-history', [HouseController::class, 'paymentHistory'])->whereNumber('id');
        Route::post('/houses/{id}/assign-resident', [HouseController::class, 'assignResident'])->whereNumber('id');
        Route::post('/houses/{id}/reassign-resident', [HouseController::class, 'reassignResident'])->whereNumber('id');

        // Dues Types
        Route::get('/dues-types', [DuesTypeController::class, 'index']);
        Route::put('/dues-types/{id}', [DuesTypeController::class, 'update'])->whereNumber('id');

        // Payments
        Route::get('/payments', [PaymentController::class, 'index']);
        Route::post('/payments', [PaymentController::class, 'store']);
        Route::get('/payments/{id}', [PaymentController::class, 'show'])->whereNumber('id');
        Route::patch('/payments/{id}/cancel', [PaymentController::class, 'cancel'])->whereNumber('id');

        // Expenses
        Route::get('/expenses', [ExpenseController::class, 'index']);
        Route::post('/expenses', [ExpenseController::class, 'store']);
        Route::get('/expenses/{id}', [ExpenseController::class, 'show'])->whereNumber('id');
        Route::put('/expenses/{id}', [ExpenseController::class, 'update'])->whereNumber('id');
        Route::patch('/expenses/{id}/deactivate', [ExpenseController::class, 'deactivate'])->whereNumber('id');

        // Reports
        Route::get('/reports/summary', [ReportController::class, 'summary']);
        Route::get('/reports/detail', [ReportController::class, 'detail']);
        Route::get('/reports/dashboard', [ReportController::class, 'dashboard']);
    });
});