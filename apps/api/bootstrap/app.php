<?php

use App\Exceptions\Domain\DomainException;
use App\Helpers\ApiResponse;
use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            ForceJsonResponse::class,
        ]);

        $middleware->throttleApi('60,1');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Domain exceptions (409) — generic handler via base class
        $exceptions->renderable(function (DomainException $e, Request $request) {
            return ApiResponse::error($e->getMessage(), $e->getHttpStatusCode());
        });

        // Validation exceptions (422)
        $exceptions->renderable(function (ValidationException $e, Request $request) {
            return ApiResponse::error('Validasi gagal', 422, $e->errors());
        });

        // Authentication exceptions (401)
        $exceptions->renderable(function (AuthenticationException $e, Request $request) {
            return ApiResponse::error('Anda harus login untuk mengakses resource ini', 401);
        });

        // Model not found (404)
        $exceptions->renderable(function (ModelNotFoundException $e, Request $request) {
            return ApiResponse::error('Data tidak ditemukan', 404);
        });

        // Route not found (404)
        $exceptions->renderable(function (NotFoundHttpException $e, Request $request) {
            return ApiResponse::error('Endpoint tidak ditemukan', 404);
        });

        // DB constraint violation (409)
        $exceptions->renderable(function (QueryException $e, Request $request) {
            if (str_contains($e->getMessage(), 'SQLSTATE[23000]')) {
                return ApiResponse::error(
                    'Data tidak dapat diproses karena masih terkait data lain',
                    409
                );
            }

            // Log the full exception but return generic message
            report($e);

            return ApiResponse::error('Terjadi kesalahan pada server', 500);
        });
    })
    ->create();