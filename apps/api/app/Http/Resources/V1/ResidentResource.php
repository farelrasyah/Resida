<?php

declare(strict_types=1);

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ResidentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'ktp_photo_url' => $this->ktp_photo_path ? Storage::disk('public')->url($this->ktp_photo_path) : null,
            'resident_status' => $this->resident_status->value,
            'phone_number' => $this->phone_number,
            'marital_status' => $this->marital_status->value,
            'current_house' => $this->whenLoaded('occupancies', function () {
                $house = $this->currentHouse();

                return $house ? [
                    'id' => $house->id,
                    'house_number' => $house->house_number,
                ] : null;
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
