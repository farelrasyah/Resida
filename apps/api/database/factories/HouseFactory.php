<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\HouseOccupancyStatus;
use App\Models\House;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<House>
 */
class HouseFactory extends Factory
{
    protected $model = House::class;

    public function definition(): array
    {
        return [
            'house_number' => 'H-' . fake()->unique()->numberBetween(1, 999),
            'occupancy_status' => HouseOccupancyStatus::TidakDihuni,
        ];
    }
}
