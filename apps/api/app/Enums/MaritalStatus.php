<?php

declare(strict_types=1);

namespace App\Enums;

enum MaritalStatus: string
{
    case SudahMenikah = 'sudah_menikah';
    case BelumMenikah = 'belum_menikah';
}
