<?php

declare(strict_types=1);

namespace App\Enums;

enum PaymentStatus: string
{
    case Lunas = 'lunas';
    case Dibatalkan = 'dibatalkan';
}
