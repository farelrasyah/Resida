<?php

declare(strict_types=1);

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OccupancyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'house' => [
                'id' => $this->house->id,
                'house_number' => $this->house->house_number,
            ],
            'resident' => [
                'id' => $this->resident->id,
                'full_name' => $this->resident->full_name,
            ],
            'start_date' => $this->start_date->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
