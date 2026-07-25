<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthService
{
    /**
     * Attempt to authenticate a user and generate a Sanctum token.
     *
     * @return array{token: string, user: User}|null Null if credentials are invalid.
     */
    public function login(string $email, string $password): ?array
    {
        $user = User::where('email', $email)->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            Log::info('Login gagal', ['email' => $email]);

            return null;
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return [
            'token' => $token,
            'user' => $user,
        ];
    }

    /**
     * Revoke the current access token (logout).
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }
}
