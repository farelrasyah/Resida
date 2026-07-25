<?php

declare(strict_types=1);

use App\Models\DuesType;
use App\Models\House;
use App\Models\Occupancy;
use App\Models\Payment;
use App\Models\PaymentPeriod;
use App\Models\Resident;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user, 'sanctum');

    // Seed dues types
    $this->satpam = DuesType::create([
        'code' => 'satpam',
        'name' => 'Iuran Satpam',
        'amount' => 100000,
        'default_frequency' => 'bulanan',
    ]);

    $this->kebersihan = DuesType::create([
        'code' => 'kebersihan',
        'name' => 'Iuran Kebersihan',
        'amount' => 15000,
        'default_frequency' => 'tahunan',
    ]);

    // Create house with active occupancy
    $this->house = House::factory()->create(['occupancy_status' => 'dihuni']);
    $this->resident = Resident::factory()->create();
    Occupancy::factory()->create([
        'house_id' => $this->house->id,
        'resident_id' => $this->resident->id,
        'start_date' => '2026-01-01',
        'end_date' => null,
    ]);
});

test('can create a monthly payment', function () {
    $response = $this->postJson('/api/v1/payments', [
        'house_id' => $this->house->id,
        'dues_type_id' => $this->satpam->id,
        'period_start_year' => 2026,
        'period_start_month' => 1,
        'period_count' => 1,
        'payment_date' => '2026-01-15',
    ]);

    $response->assertStatus(201)
        ->assertJson(['success' => true])
        ->assertJsonStructure([
            'data' => ['id', 'transaction_number', 'amount', 'total_amount', 'periods'],
        ]);

    $this->assertDatabaseHas('payments', [
        'house_id' => $this->house->id,
        'status' => 'lunas',
        'amount' => 100000,
        'total_amount' => 100000,
    ]);

    $this->assertDatabaseCount('payment_periods', 1);
});

test('can create annual payment with 12 period breakdown', function () {
    $response = $this->postJson('/api/v1/payments', [
        'house_id' => $this->house->id,
        'dues_type_id' => $this->kebersihan->id,
        'period_start_year' => 2026,
        'period_start_month' => 1,
        'period_count' => 12,
        'payment_date' => '2026-01-15',
    ]);

    $response->assertStatus(201);

    $this->assertDatabaseHas('payments', [
        'house_id' => $this->house->id,
        'total_amount' => 180000.00, // 15000 * 12
    ]);

    $this->assertDatabaseCount('payment_periods', 12);
});

test('cannot pay for already paid period', function () {
    // First payment
    $this->postJson('/api/v1/payments', [
        'house_id' => $this->house->id,
        'dues_type_id' => $this->satpam->id,
        'period_start_year' => 2026,
        'period_start_month' => 3,
        'period_count' => 1,
        'payment_date' => '2026-03-01',
    ])->assertStatus(201);

    // Duplicate payment for same period
    $this->postJson('/api/v1/payments', [
        'house_id' => $this->house->id,
        'dues_type_id' => $this->satpam->id,
        'period_start_year' => 2026,
        'period_start_month' => 3,
        'period_count' => 1,
        'payment_date' => '2026-03-15',
    ])->assertStatus(409);
});

test('cannot create payment for unoccupied house', function () {
    $vacantHouse = House::factory()->create(['occupancy_status' => 'tidak_dihuni']);

    $this->postJson('/api/v1/payments', [
        'house_id' => $vacantHouse->id,
        'dues_type_id' => $this->satpam->id,
        'period_start_year' => 2026,
        'period_start_month' => 1,
        'period_count' => 1,
        'payment_date' => '2026-01-15',
    ])->assertStatus(409);
});

test('can cancel a payment', function () {
    $response = $this->postJson('/api/v1/payments', [
        'house_id' => $this->house->id,
        'dues_type_id' => $this->satpam->id,
        'period_start_year' => 2026,
        'period_start_month' => 5,
        'period_count' => 1,
        'payment_date' => '2026-05-01',
    ]);

    $paymentId = $response->json('data.id');

    $this->patchJson("/api/v1/payments/{$paymentId}/cancel")
        ->assertOk()
        ->assertJson(['data' => ['status' => 'dibatalkan']]);
});

test('cannot cancel an already cancelled payment', function () {
    $response = $this->postJson('/api/v1/payments', [
        'house_id' => $this->house->id,
        'dues_type_id' => $this->satpam->id,
        'period_start_year' => 2026,
        'period_start_month' => 6,
        'period_count' => 1,
        'payment_date' => '2026-06-01',
    ]);

    $paymentId = $response->json('data.id');

    $this->patchJson("/api/v1/payments/{$paymentId}/cancel")->assertOk();
    $this->patchJson("/api/v1/payments/{$paymentId}/cancel")->assertStatus(409);
});

test('can list payments with filters', function () {
    $this->postJson('/api/v1/payments', [
        'house_id' => $this->house->id,
        'dues_type_id' => $this->satpam->id,
        'period_start_year' => 2026,
        'period_start_month' => 7,
        'period_count' => 1,
        'payment_date' => '2026-07-01',
    ]);

    $this->getJson('/api/v1/payments?house_id=' . $this->house->id)
        ->assertOk()
        ->assertJsonStructure(['data' => ['items', 'pagination']]);
});

test('snapshot amount is independent of dues type changes', function () {
    // Create payment at current rate
    $this->postJson('/api/v1/payments', [
        'house_id' => $this->house->id,
        'dues_type_id' => $this->satpam->id,
        'period_start_year' => 2026,
        'period_start_month' => 8,
        'period_count' => 1,
        'payment_date' => '2026-08-01',
    ])->assertStatus(201);

    // Change dues type amount
    $this->satpam->update(['amount' => 200000]);

    // Verify payment still has original amount
    $payment = Payment::first();
    expect((float) $payment->amount)->toBe(100000.00);
});
