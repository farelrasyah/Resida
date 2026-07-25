<?php

declare(strict_types=1);

namespace App\Exceptions\Domain;

class ResidentHasActiveOccupancyException extends DomainException
{
    protected int $httpStatusCode = 409;

    public function __construct(string $message = 'Penghuni masih aktif menghuni rumah, tidak dapat dinonaktifkan')
    {
        parent::__construct($message);
    }
}
