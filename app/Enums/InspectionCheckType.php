<?php

namespace App\Enums;

enum InspectionCheckType: string
{
    case SELECT = "SELECT";
    case PHOTO = "PHOTO";

    public function getName(): string
    {
        return match ($this) {
            self::SELECT => "Select",
            self::PHOTO => "Photo",
        };
    }
}
