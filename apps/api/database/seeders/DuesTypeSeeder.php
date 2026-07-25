<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\DuesType;
use Illuminate\Database\Seeder;

class DuesTypeSeeder extends Seeder
{
    public function run(): void
    {
        DuesType::updateOrCreate(
            ['code' => 'satpam'],
            [
                'name' => 'Iuran Satpam',
                'amount' => 100000.00,
                'default_frequency' => 'bulanan',
            ]
        );

        DuesType::updateOrCreate(
            ['code' => 'kebersihan'],
            [
                'name' => 'Iuran Kebersihan',
                'amount' => 15000.00,
                'default_frequency' => 'tahunan',
            ]
        );
    }
}
