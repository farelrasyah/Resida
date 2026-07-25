<?php

declare(strict_types=1);

use App\Models\DuesType;
use App\Models\Expense;
use App\Models\House;
use App\Models\Occupancy;
use App\Models\Resident;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user, 'sanctum');
    DuesType::create(['code' => 'satpam', 'name' => 'Iuran Satpam', 'amount' => 100000, 'default_frequency' => 'bulanan']);
    DuesType::create(['code' => 'kebersihan', 'name' => 'Iuran Kebersihan', 'amount' => 15000, 'default_frequency' => 'tahunan']);
});

test('summary returns 12 months', function () {
    $this->getJson('/api/v1/reports/summary?year=2026')
        ->assertOk()
        ->assertJsonCount(12, 'data.months');
});

test('detail includes house statuses', function () {
    House::factory()->count(3)->create();
    $this->getJson('/api/v1/reports/detail?year=2026&month=1')
        ->assertOk()
        ->assertJsonStructure(['data' => ['year', 'month', 'house_statuses']]);
});

test('dashboard returns counts', function () {
    House::factory()->count(5)->create();
    $this->getJson('/api/v1/reports/dashboard')
        ->assertOk()
        ->assertJsonStructure(['data' => ['total_houses', 'occupied_houses', 'vacant_houses']]);
});

test('vacant houses show tidak ada tagihan', function () {
    $h = House::factory()->create(['occupancy_status' => 'tidak_dihuni']);
    $r = $this->getJson('/api/v1/reports/detail?year=2026&month=1');
    $hs = collect($r->json('data.house_statuses'))->firstWhere('house_id', $h->id);
    expect($hs['dues_statuses'][0]['status'])->toBe('Tidak Ada Tagihan');
});
