<?php

declare(strict_types=1);

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HouseDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $activeOccupancy = $this->activeOccupancy;

        return [
            'id' => $this->id,
            'house_number' => $this->house_number,
            'occupancy_status' => $this->occupancy_status->value,
            'active_resident' => $activeOccupancy ? [
                'id' => $activeOccupancy->resident->id,
                'full_name' => $activeOccupancy->resident->full_name,
                'resident_status' => $activeOccupancy->resident->resident_status->value,
                'since' => $activeOccupancy->start_date->toDateString(),
            ] : null,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
