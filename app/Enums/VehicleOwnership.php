<?php

namespace App\Enums;

enum VehicleOwnership: string
{
    case INTERNAL = "INTERNAL";
    case EMPLOYEE = "EMPLOYEE";
    case VENDOR = "VENDOR";
    case FORWARDER = "FORWARDER";

    public function getName(): string
    {
        return match ($this) {
            self::INTERNAL => "Internal",
            self::EMPLOYEE => "Employee",
            self::VENDOR => "Vendor / Supplier",
            self::FORWARDER => "Forwarder",
        };
    }
}
