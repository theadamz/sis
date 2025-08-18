<?php

namespace App\Enums;

enum PagingType: string
{
    case PAGE = "page";
    case ID = 'id';
    case NONE = 'none';

    public function hasSize(): bool
    {
        return match ($this) {
            self::PAGE => true,
            self::ID => true,
            default => false,
        };
    }
}
