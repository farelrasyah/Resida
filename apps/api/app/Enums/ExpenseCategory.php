<?php

declare(strict_types=1);

namespace App\Enums;

enum ExpenseCategory: string
{
    case GajiSatpam = 'gaji_satpam';
    case ListrikUtilitas = 'listrik_utilitas';
    case Kebersihan = 'kebersihan';
    case Perbaikan = 'perbaikan';
    case Lainnya = 'lainnya';
}
