<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@resida.com'],
            [
                'name' => 'Admin RT',
                'password' => 'password',
            ]
        );
    }
}
