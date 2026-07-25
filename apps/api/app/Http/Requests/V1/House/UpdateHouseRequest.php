<?php

declare(strict_types=1);

namespace App\Http\Requests\V1\House;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHouseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'house_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('houses', 'house_number')->ignore($this->route('house')),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'house_number.required' => 'Nomor rumah wajib diisi',
            'house_number.max' => 'Nomor rumah maksimal 50 karakter',
            'house_number.unique' => 'Nomor rumah sudah terdaftar',
        ];
    }
}
