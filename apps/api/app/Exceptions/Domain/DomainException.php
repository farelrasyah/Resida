<?php

declare(strict_types=1);

namespace App\Exceptions\Domain;

use RuntimeException;

/**
 * Base class for all domain-specific exceptions.
 *
 * Each subclass carries its own HTTP status code, allowing the global
 * exception handler to convert domain errors to proper HTTP responses
 * without a long if-else chain.
 */
abstract class DomainException extends RuntimeException
{
    protected int $httpStatusCode = 409;

    public function getHttpStatusCode(): int
    {
        return $this->httpStatusCode;
    }
}
