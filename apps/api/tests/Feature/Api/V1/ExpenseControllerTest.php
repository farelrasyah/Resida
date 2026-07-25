<?php

declare(strict_types=1);

use App\Models\Expense;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user, 'sanctum');
});

test('can list expenses', function () {
    Expense::factory()->count(3)->create();

    $this->getJson('/api/v1/expenses')
        ->assertOk()
        ->assertJsonStructure(['data' => ['items', 'pagination']]);
});

test('can create expense', function () {
    $this->postJson('/api/v1/expenses', [
        'category' => 'gaji_satpam',
        'description' => 'Gaji satpam bulan Januari',
        'amount' => 1500000,
        'expense_date' => '2026-01-31',
    ])->assertStatus(201)
      ->assertJson(['success' => true]);

    $this->assertDatabaseHas('expenses', [
        'category' => 'gaji_satpam',
        'amount' => 1500000,
    ]);
});

test('can update expense', function () {
    $expense = Expense::factory()->create();

    $this->putJson("/api/v1/expenses/{$expense->id}", [
        'category' => 'perbaikan',
        'description' => 'Perbaikan pagar',
        'amount' => 500000,
        'expense_date' => '2026-02-15',
    ])->assertOk();

    $this->assertDatabaseHas('expenses', [
        'id' => $expense->id,
        'category' => 'perbaikan',
    ]);
});

test('can deactivate expense', function () {
    $expense = Expense::factory()->create();

    $this->patchJson("/api/v1/expenses/{$expense->id}/deactivate")
        ->assertOk();

    $this->assertSoftDeleted('expenses', ['id' => $expense->id]);
});

test('validates required fields on create', function () {
    $this->postJson('/api/v1/expenses', [])
        ->assertStatus(422);
});
