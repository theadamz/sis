<?php

namespace App\Enums;

enum InspectionType: string
{
    case VEHICLE = "VEHICLE";
    case ROOM = "ROOM";

    public function getName(): string
    {
        return match ($this) {
            self::VEHICLE => "Vehicle Inspection",
            self::ROOM => "Room Inspection",
        };
    }
}
