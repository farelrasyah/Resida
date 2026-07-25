<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\MaritalStatus;
use App\Enums\ResidentStatus;
use Database\Factories\ResidentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Resident extends Model
{
    /** @use HasFactory<ResidentFactory> */
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'full_name',
        'ktp_photo_path',
        'resident_status',
        'phone_number',
        'marital_status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'resident_status' => ResidentStatus::class,
            'marital_status' => MaritalStatus::class,
        ];
    }

    /**
     * Get all occupancy records for this resident.
     */
    public function occupancies(): HasMany
    {
        return $this->hasMany(Occupancy::class);
    }

    /**
     * Get all payments made by this resident.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get the current house this resident occupies (via active occupancy).
     * Returns null if the resident is not currently occupying any house.
     */
    public function currentHouse(): ?House
    {
        $activeOccupancy = $this->occupancies()
            ->whereNull('end_date')
            ->with('house')
            ->first();

        return $activeOccupancy?->house;
    }
}
