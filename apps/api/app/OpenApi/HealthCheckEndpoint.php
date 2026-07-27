<?php

declare(strict_types=1);

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Get(
    path: '/health',
    summary: 'Health check API',
    description: 'Endpoint publik untuk mengecek status API. Tidak memerlukan autentikasi.',
    tags: ['Authentication'],
    responses: [
        new OA\Response(
            response: 200,
            description: 'API berjalan normal.',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'success', type: 'boolean', example: true),
                    new OA\Property(property: 'message', type: 'string', example: 'RESIDA API is running.'),
                    new OA\Property(property: 'data', type: 'object', properties: [
                        new OA\Property(property: 'version', type: 'string', example: 'v1'),
                    ]),
                ],
                type: 'object'
            )
        ),
    ]
)]
class HealthCheckEndpoint
{
}
