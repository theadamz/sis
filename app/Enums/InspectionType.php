<?php

namespace App\Enums;

enum InspectionType: string
{
    case VHC_INS = "VHC_INS";
    case ROOM_INS = "ROOM_INS";

    public function getName(): string
    {
        return match ($this) {
            self::VHC_INS => "Vehicle Inspection",
            self::ROOM_INS => "Room Inspection",
        };
    }
}
