<?php

declare(strict_types=1);

namespace App\Exceptions\Domain;

class HouseStillOccupiedException extends DomainException
{
    protected int $httpStatusCode = 409;

    public function __construct(string $message = 'Rumah masih dihuni, tidak dapat dinonaktifkan')
    {
        parent::__construct($message);
    }
}
