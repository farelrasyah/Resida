<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\HouseOccupancyStatus;
use Database\Factories\HouseFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class House extends Model
{
    /** @use HasFactory<HouseFactory> */
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'house_number',
        'occupancy_status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'occupancy_status' => HouseOccupancyStatus::class,
        ];
    }

    /**
     * Get all occupancy records for this house.
     */
    public function occupancies(): HasMany
    {
        return $this->hasMany(Occupancy::class);
    }

    /**
     * Get all payments for this house.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get all payment period records for this house.
     */
    public function paymentPeriods(): HasMany
    {
        return $this->hasMany(PaymentPeriod::class);
    }

    /**
     * Get the currently active occupancy (end_date IS NULL).
     */
    public function activeOccupancy(): HasOne
    {
        return $this->hasOne(Occupancy::class)->whereNull('end_date');
    }

    /**
     * Scope query to only occupied houses.
     */
    public function scopeOccupied(Builder $query): Builder
    {
        return $query->where('occupancy_status', HouseOccupancyStatus::Dihuni);
    }

    /**
     * Scope query to only vacant houses.
     */
    public function scopeVacant(Builder $query): Builder
    {
        return $query->where('occupancy_status', HouseOccupancyStatus::TidakDihuni);
    }
}
