<?php

declare(strict_types=1);

use App\Models\House;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user, 'sanctum');
});

test('can list houses', function () {
    House::factory()->count(3)->create();

    $this->getJson('/api/v1/houses')
        ->assertOk()
        ->assertJsonStructure([
            'success', 'message', 'data' => ['items', 'pagination'],
        ]);
});

test('can create a house', function () {
    $this->postJson('/api/v1/houses', ['house_number' => 'B-01'])
        ->assertStatus(201)
        ->assertJson([
            'success' => true,
            'data' => ['house_number' => 'B-01', 'occupancy_status' => 'tidak_dihuni'],
        ]);

    $this->assertDatabaseHas('houses', ['house_number' => 'B-01']);
});

test('cannot create house with duplicate number', function () {
    House::factory()->create(['house_number' => 'B-01']);

    $this->postJson('/api/v1/houses', ['house_number' => 'B-01'])
        ->assertStatus(422);
});

test('can show house detail', function () {
    $house = House::factory()->create();

    $this->getJson("/api/v1/houses/{$house->id}")
        ->assertOk()
        ->assertJsonStructure([
            'data' => ['id', 'house_number', 'occupancy_status', 'active_resident'],
        ]);
});

test('can update a house', function () {
    $house = House::factory()->create(['house_number' => 'OLD-01']);

    $this->putJson("/api/v1/houses/{$house->id}", ['house_number' => 'NEW-01'])
        ->assertOk();

    $this->assertDatabaseHas('houses', ['id' => $house->id, 'house_number' => 'NEW-01']);
});

test('can deactivate vacant house', function () {
    $house = House::factory()->create(['occupancy_status' => 'tidak_dihuni']);

    $this->patchJson("/api/v1/houses/{$house->id}/deactivate")
        ->assertOk();

    $this->assertSoftDeleted('houses', ['id' => $house->id]);
});

test('cannot deactivate occupied house', function () {
    $house = House::factory()->create(['occupancy_status' => 'dihuni']);

    $this->patchJson("/api/v1/houses/{$house->id}/deactivate")
        ->assertStatus(409);
});

test('returns 404 for non-existent house', function () {
    $this->getJson('/api/v1/houses/99999')
        ->assertStatus(404);
});
