<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\DuesType;
use Illuminate\Database\Eloquent\Collection;

class DuesTypeService
{
    /**
     * Get all dues types.
     */
    public function getAll(): Collection
    {
        return DuesType::all();
    }

    /**
     * Update the amount for a dues type (only amount is configurable, code is immutable).
     */
    public function updateAmount(int $id, float $amount): DuesType
    {
        $duesType = DuesType::findOrFail($id);
        $duesType->update(['amount' => $amount]);

        return $duesType->fresh();
    }
}
