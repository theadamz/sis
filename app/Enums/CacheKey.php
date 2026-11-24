<?php

namespace App\Enums;

use Illuminate\Support\Arr;

enum CacheKey: string
{
    case PAT = 'PAT'; // personal access token
    case ACCESS = "ACCESS";
    case MENU = "MENU";
    case TIMEZONE = "TIMEZONE";
    case ENTITY = 'ENTITY';
    case SITE = 'SITE';
    case GATE = 'GATE';
    case USER = 'USER';
    case INSPECTION_CATEGORY = 'INSPECTION_CATEGORY';
    case INSPECTION_FLOW = 'INSPECTION_FLOW';
    case INSPECTION_FLOW_STAGE = 'INSPECTION_FLOW_STAGE';
    case INSPECTION_FORM = 'INSPECTION_FORM';
    case INSPECTION_VEHICLE = 'INSPECTION_VEHICLE';
    case REGISTERED_VEHICLE = 'REGISTERED_VEHICLE';

    public function getKey(?string ...$additionalKeys): string
    {
        return $this->value . "::" . (!empty($additionalKeys) ? Arr::join($additionalKeys, '.') : '') . (empty(request()->getQueryString()) ? '' : '?' . request()->getQueryString());
    }

    public function getKeyWithoutRequest(?string ...$additionalKeys): string
    {
        return $this->value  . "::" . (!empty($additionalKeys) ? Arr::join($additionalKeys, '.') : '');
    }

    public static function getKeyAccess(?string ...$additionalKeys): string
    {
        return self::ACCESS->getKeyWithoutRequest(...$additionalKeys);
    }
}
