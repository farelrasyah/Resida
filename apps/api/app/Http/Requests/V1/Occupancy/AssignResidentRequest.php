<?php

declare(strict_types=1);

namespace App\Http\Requests\V1\Occupancy;

use Illuminate\Foundation\Http\FormRequest;

class AssignResidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'resident_id' => ['required', 'integer', 'exists:residents,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'resident_id.required' => 'ID penghuni wajib diisi',
            'resident_id.integer' => 'ID penghuni harus berupa angka',
            'resident_id.exists' => 'Penghuni tidak ditemukan',
        ];
    }
}
