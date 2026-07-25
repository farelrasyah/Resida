<?php

declare(strict_types=1);

namespace App\Exceptions\Domain;

class PaymentAlreadyFinalizedException extends DomainException
{
    protected int $httpStatusCode = 409;

    public function __construct(string $message = 'Pembayaran ini sudah dibatalkan sebelumnya')
    {
        parent::__construct($message);
    }
}
