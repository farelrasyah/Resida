<?php

declare(strict_types=1);

use App\Models\House;
use App\Models\Occupancy;
use App\Models\Resident;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user, 'sanctum');
});

test('can assign resident to vacant house', function () {
    $house = House::factory()->create(['occupancy_status' => 'tidak_dihuni']);
    $resident = Resident::factory()->create();

    $response = $this->postJson("/api/v1/houses/{$house->id}/assign-resident", [
        'resident_id' => $resident->id,
    ]);

    $response->assertStatus(201)
        ->assertJson(['success' => true]);

    $this->assertDatabaseHas('occupancies', [
        'house_id' => $house->id,
        'resident_id' => $resident->id,
        'end_date' => null,
    ]);

    $this->assertDatabaseHas('houses', [
        'id' => $house->id,
        'occupancy_status' => 'dihuni',
    ]);
});

test('cannot assign to already occupied house', function () {
    $house = House::factory()->create(['occupancy_status' => 'dihuni']);
    $existingResident = Resident::factory()->create();
    Occupancy::factory()->create([
        'house_id' => $house->id,
        'resident_id' => $existingResident->id,
        'end_date' => null,
    ]);

    $newResident = Resident::factory()->create();

    $this->postJson("/api/v1/houses/{$house->id}/assign-resident", [
        'resident_id' => $newResident->id,
    ])->assertStatus(409);
});

test('cannot assign resident already active elsewhere', function () {
    $house1 = House::factory()->create(['occupancy_status' => 'dihuni']);
    $house2 = House::factory()->create(['occupancy_status' => 'tidak_dihuni']);
    $resident = Resident::factory()->create();

    Occupancy::factory()->create([
        'house_id' => $house1->id,
        'resident_id' => $resident->id,
        'end_date' => null,
    ]);

    $this->postJson("/api/v1/houses/{$house2->id}/assign-resident", [
        'resident_id' => $resident->id,
    ])->assertStatus(409);
});

test('can reassign house to new resident', function () {
    $house = House::factory()->create(['occupancy_status' => 'dihuni']);
    $oldResident = Resident::factory()->create();
    Occupancy::factory()->create([
        'house_id' => $house->id,
        'resident_id' => $oldResident->id,
        'start_date' => '2025-01-01',
        'end_date' => null,
    ]);

    $newResident = Resident::factory()->create();

    $response = $this->postJson("/api/v1/houses/{$house->id}/reassign-resident", [
        'resident_id' => $newResident->id,
    ]);

    $response->assertOk()
        ->assertJson(['success' => true]);

    // Old occupancy should be closed
    $this->assertDatabaseMissing('occupancies', [
        'house_id' => $house->id,
        'resident_id' => $oldResident->id,
        'end_date' => null,
    ]);

    // New occupancy should be active
    $this->assertDatabaseHas('occupancies', [
        'house_id' => $house->id,
        'resident_id' => $newResident->id,
        'end_date' => null,
    ]);
});

test('can view occupancy history', function () {
    $house = House::factory()->create();
    Occupancy::factory()->count(3)->create([
        'house_id' => $house->id,
    ]);

    $this->getJson("/api/v1/houses/{$house->id}/occupancy-history")
        ->assertOk()
        ->assertJsonCount(3, 'data');
});
