<?php

namespace App\Enums;

enum StageTransactionType: string
{
    case INSPECTION = 'INS';

    public function getName(): string
    {
        return match ($this) {
            self::INSPECTION => "Inspection"
        };
    }
}
