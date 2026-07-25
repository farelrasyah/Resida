<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\House;
use Illuminate\Database\Seeder;

class HouseSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 20; $i++) {
            House::updateOrCreate(
                ['house_number' => sprintf('A-%02d', $i)],
                ['occupancy_status' => 'tidak_dihuni']
            );
        }
    }
}
