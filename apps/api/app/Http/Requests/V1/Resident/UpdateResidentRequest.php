<?php

declare(strict_types=1);

namespace App\Http\Requests\V1\Resident;

use App\Enums\MaritalStatus;
use App\Enums\ResidentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateResidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'ktp_photo' => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:2048'],
            'resident_status' => ['required', Rule::enum(ResidentStatus::class)],
            'phone_number' => ['required', 'numeric', 'digits_between:10,15'],
            'marital_status' => ['required', Rule::enum(MaritalStatus::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'Nama lengkap wajib diisi',
            'full_name.max' => 'Nama lengkap maksimal 255 karakter',
            'ktp_photo.file' => 'Foto KTP harus berupa file',
            'ktp_photo.mimes' => 'Foto KTP harus berformat JPG, JPEG, atau PNG',
            'ktp_photo.max' => 'Ukuran foto KTP maksimal 2MB',
            'resident_status.required' => 'Status penghuni wajib diisi',
            'resident_status.enum' => 'Status penghuni harus kontrak atau tetap',
            'phone_number.required' => 'Nomor telepon wajib diisi',
            'phone_number.numeric' => 'Nomor telepon harus berupa angka',
            'phone_number.digits_between' => 'Nomor telepon harus 10-15 digit',
            'marital_status.required' => 'Status pernikahan wajib diisi',
            'marital_status.enum' => 'Status pernikahan tidak valid',
        ];
    }
}
