<?php

declare(strict_types=1);

namespace App\Http\Requests\V1\DuesType;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDuesTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'gt:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'Nominal wajib diisi',
            'amount.numeric' => 'Nominal harus berupa angka',
            'amount.gt' => 'Nominal harus lebih dari 0',
        ];
    }
}
