<?php

declare(strict_types=1);

namespace App\Http\Requests\V1\Expense;

use App\Enums\ExpenseCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category' => ['required', Rule::enum(ExpenseCategory::class)],
            'description' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'expense_date' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'category.required' => 'Kategori pengeluaran wajib dipilih',
            'category.enum' => 'Kategori pengeluaran tidak valid',
            'description.required' => 'Deskripsi pengeluaran wajib diisi',
            'description.max' => 'Deskripsi maksimal 255 karakter',
            'amount.required' => 'Nominal wajib diisi',
            'amount.numeric' => 'Nominal harus berupa angka',
            'amount.gt' => 'Nominal harus lebih dari 0',
            'expense_date.required' => 'Tanggal pengeluaran wajib diisi',
            'expense_date.date' => 'Format tanggal tidak valid',
        ];
    }
}
