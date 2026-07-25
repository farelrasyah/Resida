<?php

declare(strict_types=1);

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'transaction_number' => $this->transaction_number,
            'house' => [
                'id' => $this->house->id,
                'house_number' => $this->house->house_number,
            ],
            'resident' => [
                'id' => $this->resident->id,
                'full_name' => $this->resident->full_name,
            ],
            'dues_type' => [
                'id' => $this->duesType->id,
                'code' => $this->duesType->code->value,
                'name' => $this->duesType->name,
            ],
            'amount' => (float) $this->amount,
            'total_amount' => (float) $this->total_amount,
            'payment_date' => $this->payment_date->toDateString(),
            'status' => $this->status->value,
            'notes' => $this->notes,
            'periods' => $this->whenLoaded('periods', fn () => $this->periods->map(fn ($p) => [
                'id' => $p->id,
                'period_year' => $p->period_year,
                'period_month' => $p->period_month,
            ])),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
