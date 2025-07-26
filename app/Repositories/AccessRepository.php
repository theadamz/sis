<?php

namespace App\Repositories;

use App\Models\Config\Access;
use App\Repositories\Contracts\AccessRepository as AccessRepositoryContract;
use Illuminate\Support\Collection;

class AccessRepository implements AccessRepositoryContract
{

    public function hasAccess(string $siteId, string $userId, string $menuCode): bool
    {
        return Access::where([
            ['site_id', '=', $siteId],
            ['user_id', '=', $userId],
            ['code', '=', $menuCode],
        ])->exists();
    }

    public function isAllowed(string $siteId, string $userId, string $menuCode, ?string $permission = 'read'): bool
    {
        // get data access
        $isAllowed = Access::where([
            ['site_id', '=', $siteId],
            ['user_id', '=', $userId],
            ['code', '=', $menuCode],
            ['permission', '=', $permission]
        ])->value('is_allowed');

        // if empty then return false
        if (empty($isAllowed)) {
            return false;
        }

        return $isAllowed;
    }

    public function getPermissions(string $siteId, string $userId, string $menuCode): ?Collection
    {
        // get data access
        $accesses = Access::where([
            ['site_id', '=', $siteId],
            ['user_id', '=', $userId],
            ['code', '=', $menuCode],
        ])->get(['permission', 'is_allowed']);

        // refactor
        $accesses = $accesses->mapWithKeys(function (Access $row, int $key) {
            return [$row->permission => boolval($row->is_allowed)];
        });

        return $accesses;
    }

    public function getUserAccesses(string $siteId, string $userId): ?Collection
    {
        // get data access
        return Access::where([
            ['site_id', '=', $siteId],
            ['user_id', '=', $userId],
            ['is_allowed', '=', true],
        ])->pluck('code')->unique()->values();
    }
}
