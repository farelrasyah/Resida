<?php

declare(strict_types=1);

namespace App\Enums;

enum HouseOccupancyStatus: string
{
    case Dihuni = 'dihuni';
    case TidakDihuni = 'tidak_dihuni';
}
