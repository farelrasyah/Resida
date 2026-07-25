<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\DuesTypeCode;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DuesType extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'name',
        'amount',
        'default_frequency',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'code' => DuesTypeCode::class,
            'amount' => 'decimal:2',
        ];
    }

    /**
     * Get all payments for this dues type.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get all payment period records for this dues type.
     */
    public function paymentPeriods(): HasMany
    {
        return $this->hasMany(PaymentPeriod::class);
    }
}
