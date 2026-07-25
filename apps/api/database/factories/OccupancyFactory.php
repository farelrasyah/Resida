<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\House;
use App\Models\Occupancy;
use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Occupancy>
 */
class OccupancyFactory extends Factory
{
    protected $model = Occupancy::class;

    public function definition(): array
    {
        return [
            'house_id' => House::factory(),
            'resident_id' => Resident::factory(),
            'start_date' => fake()->dateTimeBetween('-1 year', 'now'),
            'end_date' => null,
        ];
    }

    /**
     * Indicate that the occupancy has ended.
     */
    public function ended(): static
    {
        return $this->state(fn (array $attributes) => [
            'end_date' => fake()->dateTimeBetween($attributes['start_date'], 'now'),
        ]);
    }
}
