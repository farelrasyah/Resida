<?php

declare(strict_types=1);

namespace App\Exceptions\Domain;

class HouseNotOccupiedException extends DomainException
{
    protected int $httpStatusCode = 409;

    public function __construct(string $message = 'Rumah tidak berpenghuni, tidak dapat mencatat pembayaran')
    {
        parent::__construct($message);
    }
}
