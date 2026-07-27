<?php

declare(strict_types=1);

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    title: 'RESIDA API',
    description: 'REST API untuk sistem informasi manajemen warga perumahan. Mencakup manajemen penghuni, rumah, iuran, pembayaran, pengeluaran, dan laporan keuangan.',
)]
#[OA\Server(
    url: 'http://localhost:8000/api/v1',
    description: 'Local development server',
)]
#[OA\SecurityScheme(
    securityScheme: 'bearerAuth',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'Sanctum',
    description: 'Masukkan token Sanctum. Format: Bearer {token}',
)]
#[OA\Tag(name: 'Authentication', description: 'Login dan logout. Endpoint publik (tidak memerlukan token).')]
#[OA\Tag(name: 'Residents', description: 'CRUD data penghuni. Membutuhkan autentikasi.')]
#[OA\Tag(name: 'Houses', description: 'CRUD data rumah, status hunian, penempatan penghuni. Membutuhkan autentikasi.')]
#[OA\Tag(name: 'Dues Types', description: 'Master data jenis iuran. Membutuhkan autentikasi.')]
#[OA\Tag(name: 'Payments', description: 'Pencatatan pembayaran iuran. Membutuhkan autentikasi.')]
#[OA\Tag(name: 'Expenses', description: 'CRUD pengeluaran kas. Membutuhkan autentikasi.')]
#[OA\Tag(name: 'Reports', description: 'Laporan keuangan dan ringkasan dashboard. Membutuhkan autentikasi.')]
class OpenApiSpec
{
}
