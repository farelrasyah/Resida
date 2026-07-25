<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\MaritalStatus;
use App\Enums\ResidentStatus;
use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Resident>
 */
class ResidentFactory extends Factory
{
    protected $model = Resident::class;

    public function definition(): array
    {
        return [
            'full_name' => fake('id_ID')->name(),
            'ktp_photo_path' => 'ktp/' . fake()->uuid() . '.jpg',
            'resident_status' => fake()->randomElement(ResidentStatus::cases()),
            'phone_number' => '08' . fake()->numerify('##########'),
            'marital_status' => fake()->randomElement(MaritalStatus::cases()),
        ];
    }
}
