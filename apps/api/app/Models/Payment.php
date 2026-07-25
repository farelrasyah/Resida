<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\PaymentStatus;
use Database\Factories\PaymentFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Payment extends Model
{
    /** @use HasFactory<PaymentFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'transaction_number',
        'house_id',
        'resident_id',
        'dues_type_id',
        'amount',
        'total_amount',
        'payment_date',
        'status',
        'notes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => PaymentStatus::class,
            'amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'payment_date' => 'date',
        ];
    }

    /**
     * Get the house for this payment.
     */
    public function house(): BelongsTo
    {
        return $this->belongsTo(House::class);
    }

    /**
     * Get the resident who made this payment.
     */
    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    /**
     * Get the dues type for this payment.
     */
    public function duesType(): BelongsTo
    {
        return $this->belongsTo(DuesType::class);
    }

    /**
     * Get all period breakdowns for this payment.
     */
    public function periods(): HasMany
    {
        return $this->hasMany(PaymentPeriod::class);
    }

    /**
     * Scope query to only finalized (lunas) payments.
     */
    public function scopeFinalized(Builder $query): Builder
    {
        return $query->where('status', PaymentStatus::Lunas);
    }
}
