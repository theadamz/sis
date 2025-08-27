<?php

namespace App\Enums;

enum InspectionStage: string
{
    case CHECKED_IN = 'CHECKED_IN';
    case LOADING = 'LOADING';
    case CHECKED_OUT = 'CHECKED_OUT';

    public function getName(): string
    {
        return match ($this) {
            self::CHECKED_IN => "Checked In",
            self::LOADING => "Loading",
            self::CHECKED_OUT => "Checked Out",
        };
    }
}
