<?php

namespace App\Enums;

enum TransactionType: string
{
    case VHC_INS = "VHCINS";
    case ROOM_INS = "RMINS";

    public function getName(): string
    {
        return match ($this) {
            self::VHC_INS => "Vehicle Inspection",
            self::ROOM_INS => "Room Inspection",
        };
    }
}
