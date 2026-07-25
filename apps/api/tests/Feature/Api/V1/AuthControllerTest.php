<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create([
        'email' => 'admin@resida.com',
        'password' => 'password',
    ]);
});

test('login with valid credentials returns token', function () {
    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'admin@resida.com',
        'password' => 'password',
    ]);

    $response->assertOk()
        ->assertJsonStructure([
            'success',
            'message',
            'data' => ['token', 'user' => ['id', 'name', 'email']],
        ])
        ->assertJson(['success' => true]);
});

test('login with invalid credentials returns 401', function () {
    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'admin@resida.com',
        'password' => 'wrong-password',
    ]);

    $response->assertStatus(401)
        ->assertJson([
            'success' => false,
            'message' => 'Email atau password salah',
        ]);
});

test('login with missing fields returns 422', function () {
    $response = $this->postJson('/api/v1/auth/login', []);

    $response->assertStatus(422)
        ->assertJson(['success' => false]);
});

test('logout revokes current token', function () {
    $token = $this->user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/v1/auth/logout');

    $response->assertOk()
        ->assertJson(['success' => true, 'message' => 'Logout berhasil']);

    // Token should no longer work
    $this->withHeader('Authorization', "Bearer {$token}")
        ->getJson('/api/v1/residents')
        ->assertStatus(401);
});

test('accessing protected route without token returns 401', function () {
    $this->getJson('/api/v1/residents')
        ->assertStatus(401);
});
