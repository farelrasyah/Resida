<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface PaymentRepositoryInterface
{
    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?Payment;

    public function findByIdOrFail(int $id): Payment;

    public function create(array $data): Payment;

    public function updateStatus(Payment $payment, string $status): void;

    public function getByHouseId(int $houseId, array $filters = []): Collection;

    public function getMonthlyIncomeByPeriods(int $year): array;

    public function getIncomeBeforeYear(int $year): float;
}
