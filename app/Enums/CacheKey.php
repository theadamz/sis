<?php

namespace App\Enums;

enum CacheKey: string
{
    case TIMEZONE = "TIMEZONE";
    case ENTITY = 'entity';
    case SITE = 'site';
    case GATE = 'gate';
    case USER = 'user';

    public function getKey(): string
    {
        return $this->value . (empty(request()->getQueryString()) ? '' : '?' . request()->getQueryString());
    }
}
