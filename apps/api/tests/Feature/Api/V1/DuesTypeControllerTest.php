<?php

declare(strict_types=1);

use App\Models\DuesType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user, 'sanctum');

    DuesType::create([
        'code' => 'satpam',
        'name' => 'Iuran Satpam',
        'amount' => 100000,
        'default_frequency' => 'bulanan',
    ]);

    DuesType::create([
        'code' => 'kebersihan',
        'name' => 'Iuran Kebersihan',
        'amount' => 15000,
        'default_frequency' => 'tahunan',
    ]);
});

test('can list dues types', function () {
    $this->getJson('/api/v1/dues-types')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

test('can update dues type amount', function () {
    $duesType = DuesType::where('code', 'satpam')->first();

    $this->putJson("/api/v1/dues-types/{$duesType->id}", [
        'amount' => 150000,
    ])->assertOk()
      ->assertJson(['data' => ['amount' => 150000]]);
});

test('cannot set amount to zero or negative', function () {
    $duesType = DuesType::where('code', 'satpam')->first();

    $this->putJson("/api/v1/dues-types/{$duesType->id}", [
        'amount' => 0,
    ])->assertStatus(422);

    $this->putJson("/api/v1/dues-types/{$duesType->id}", [
        'amount' => -100,
    ])->assertStatus(422);
});
