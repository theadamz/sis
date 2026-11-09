<?php

namespace App\Helpers;

use App\Services\AccessService;
use Illuminate\Support\Collection;

class AccessHelper
{
    public static function hasAccess(string $siteId, string $userId, string $menuCode): bool
    {
        return app(AccessService::class)->hasAccess(siteId: $siteId, userId: $userId, menuCode: $menuCode);
    }

    public static function isAllowed(string $siteId, string $userId, string $menuCode, ?string $permission): bool
    {
        return app(AccessService::class)->isAllowed(siteId: $siteId, userId: $userId, menuCode: $menuCode, permission: $permission);
    }

    public static function getPermissions(string $siteId, string $userId, string $menuCode): Collection
    {
        return app(AccessService::class)->getPermissions(siteId: $siteId, userId: $userId, menuCode: $menuCode);
    }

    public static function getUserAccesses(string $siteId, string $userId): Collection
    {
        return app(AccessService::class)->getUserAccesses($siteId, $userId);
    }
}
