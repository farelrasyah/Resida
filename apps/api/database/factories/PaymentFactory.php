<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\PaymentStatus;
use App\Models\DuesType;
use App\Models\House;
use App\Models\Payment;
use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        $amount = fake()->randomElement([15000, 100000]);

        return [
            'transaction_number' => 'PAY-' . now()->format('Ymd') . '-' . fake()->unique()->numerify('####'),
            'house_id' => House::factory(),
            'resident_id' => Resident::factory(),
            'dues_type_id' => DuesType::factory(),
            'amount' => $amount,
            'total_amount' => $amount,
            'payment_date' => fake()->dateTimeBetween('-6 months', 'now'),
            'status' => PaymentStatus::Lunas,
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
