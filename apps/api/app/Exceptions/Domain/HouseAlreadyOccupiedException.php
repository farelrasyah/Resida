<?php

declare(strict_types=1);

namespace App\Exceptions\Domain;

class HouseAlreadyOccupiedException extends DomainException
{
    protected int $httpStatusCode = 409;

    public function __construct(string $message = 'Rumah ini sudah memiliki penghuni aktif')
    {
        parent::__construct($message);
    }
}
