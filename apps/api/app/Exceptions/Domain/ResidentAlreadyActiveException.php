<?php

declare(strict_types=1);

namespace App\Exceptions\Domain;

class ResidentAlreadyActiveException extends DomainException
{
    protected int $httpStatusCode = 409;

    public function __construct(string $message = 'Penghuni ini sudah aktif di rumah lain')
    {
        parent::__construct($message);
    }
}
