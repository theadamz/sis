<?php

namespace App\Enums;

enum InspectionCheckType: string
{
    case SELECT = "SELECT";
    case PHOTO = "PHOTO";
    case SELECT_PHOTO = "SELECT_PHOTO";

    public function getName(): string
    {
        return match ($this) {
            self::SELECT => "Select",
            self::PHOTO => "Photo",
            self::SELECT_PHOTO => "Select + Photo",
        };
    }
}
