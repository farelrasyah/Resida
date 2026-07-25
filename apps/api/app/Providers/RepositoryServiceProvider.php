<?php

declare(strict_types=1);

namespace App\Providers;

use App\Repositories\Contracts\ExpenseRepositoryInterface;
use App\Repositories\Contracts\HouseRepositoryInterface;
use App\Repositories\Contracts\OccupancyRepositoryInterface;
use App\Repositories\Contracts\PaymentPeriodRepositoryInterface;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use App\Repositories\Contracts\ResidentRepositoryInterface;
use App\Repositories\Eloquent\ExpenseRepository;
use App\Repositories\Eloquent\HouseRepository;
use App\Repositories\Eloquent\OccupancyRepository;
use App\Repositories\Eloquent\PaymentPeriodRepository;
use App\Repositories\Eloquent\PaymentRepository;
use App\Repositories\Eloquent\ResidentRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * All repository interface-to-implementation bindings.
     *
     * @var array<class-string, class-string>
     */
    public array $bindings = [
        ResidentRepositoryInterface::class => ResidentRepository::class,
        HouseRepositoryInterface::class => HouseRepository::class,
        OccupancyRepositoryInterface::class => OccupancyRepository::class,
        PaymentRepositoryInterface::class => PaymentRepository::class,
        PaymentPeriodRepositoryInterface::class => PaymentPeriodRepository::class,
        ExpenseRepositoryInterface::class => ExpenseRepository::class,
    ];

    public function register(): void
    {
        //
    }
}
