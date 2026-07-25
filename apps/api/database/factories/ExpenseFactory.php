<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ExpenseCategory;
use App\Models\Expense;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Expense>
 */
class ExpenseFactory extends Factory
{
    protected $model = Expense::class;

    public function definition(): array
    {
        return [
            'category' => fake()->randomElement(ExpenseCategory::cases()),
            'description' => fake('id_ID')->sentence(),
            'amount' => fake()->numberBetween(50000, 5000000),
            'expense_date' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }
}
