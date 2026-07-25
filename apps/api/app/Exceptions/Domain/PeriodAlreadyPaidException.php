<?php

declare(strict_types=1);

namespace App\Exceptions\Domain;

class PeriodAlreadyPaidException extends DomainException
{
    protected int $httpStatusCode = 409;

    public function __construct(string $message = 'Periode ini sudah tercatat lunas sebelumnya')
    {
        parent::__construct($message);
    }
}
