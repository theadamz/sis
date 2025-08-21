<?php

namespace App\Enums;

enum InspectionFlow: string
{
    case IN = 'IN';
    case OUT = 'OUT';

    public function getName(): string
    {
        return match ($this) {
            self::IN => "In",
            self::OUT => "Out",
        };
    }
}
