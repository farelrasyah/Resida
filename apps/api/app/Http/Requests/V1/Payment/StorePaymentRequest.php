<?php

declare(strict_types=1);

namespace App\Http\Requests\V1\Payment;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'house_id' => ['required', 'integer', 'exists:houses,id'],
            'dues_type_id' => ['required', 'integer', 'exists:dues_types,id'],
            'period_start_year' => ['required', 'integer', 'min:2000', 'max:2100'],
            'period_start_month' => ['required', 'integer', 'min:1', 'max:12'],
            'period_count' => ['sometimes', 'integer', 'min:1', 'max:12'],
            'payment_date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'house_id.required' => 'Rumah wajib dipilih',
            'house_id.exists' => 'Rumah tidak ditemukan',
            'dues_type_id.required' => 'Jenis iuran wajib dipilih',
            'dues_type_id.exists' => 'Jenis iuran tidak ditemukan',
            'period_start_year.required' => 'Tahun periode wajib diisi',
            'period_start_year.min' => 'Tahun periode tidak valid',
            'period_start_month.required' => 'Bulan periode wajib diisi',
            'period_start_month.min' => 'Bulan periode harus antara 1-12',
            'period_start_month.max' => 'Bulan periode harus antara 1-12',
            'period_count.min' => 'Jumlah periode minimal 1',
            'period_count.max' => 'Jumlah periode maksimal 12',
            'payment_date.required' => 'Tanggal pembayaran wajib diisi',
            'payment_date.date' => 'Format tanggal tidak valid',
            'notes.max' => 'Catatan maksimal 255 karakter',
        ];
    }
}
