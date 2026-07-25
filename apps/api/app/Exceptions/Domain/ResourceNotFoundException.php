<?php

declare(strict_types=1);

namespace App\Exceptions\Domain;

class ResourceNotFoundException extends DomainException
{
    protected int $httpStatusCode = 404;

    public function __construct(string $message = 'Data tidak ditemukan')
    {
        parent::__construct($message);
    }
}
