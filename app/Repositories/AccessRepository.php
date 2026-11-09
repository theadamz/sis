<?php

namespace App\Repositories;

use App\Enums\CacheKey;
use App\Models\Config\Access;
use App\Repositories\Contracts\AccessRepository as AccessRepositoryContract;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class AccessRepository implements AccessRepositoryContract
{
    private string $cacheStore = 'file';

    public function hasAccess(string $siteId, string $userId, string $menuCode): bool
    {
        // get cache key
        $cacheKey = CacheKey::getKeyAccess('hasAccess', $userId, $siteId, $menuCode);
        if (Cache::store($this->cacheStore)->has($cacheKey)) {
            return Cache::store($this->cacheStore)->get($cacheKey);
        }

        $data = Access::where([
            ['site_id', '=', $siteId],
            ['user_id', '=', $userId],
            ['code', '=', $menuCode],
        ])->exists();

        // cache it
        if (!empty($data)) {
            Cache::store($this->cacheStore)->put($cacheKey, $data, now()->addMinutes(10));
        }

        return $data;
    }

    public function isAllowed(string $siteId, string $userId, string $menuCode, ?string $permission = 'read'): bool
    {
        // get cache key
        $cacheKey = CacheKey::getKeyAccess('isAllowed', $userId, $siteId, $menuCode, $permission);
        if (Cache::store($this->cacheStore)->has($cacheKey)) {
            return Cache::store($this->cacheStore)->get($cacheKey);
        }

        // get data access
        $isAllowed = Access::where([
            ['site_id', '=', $siteId],
            ['user_id', '=', $userId],
            ['code', '=', $menuCode],
            ['permission', '=', $permission]
        ])->value('is_allowed');

        // if empty then return false
        if (empty($isAllowed)) {
            $isAllowed = false;
        }

        // cache it
        Cache::store($this->cacheStore)->put($cacheKey, $isAllowed, now()->addMinutes(10));

        return $isAllowed;
    }

    public function getPermissions(string $siteId, string $userId, string $menuCode): ?Collection
    {
        // get cache key
        $cacheKey = CacheKey::getKeyAccess('getPermissions', $userId, $siteId, $menuCode);
        if (Cache::store($this->cacheStore)->has($cacheKey)) {
            return Cache::store($this->cacheStore)->get($cacheKey);
        }

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

        // cache it
        Cache::store($this->cacheStore)->put($cacheKey, $accesses, now()->addMinutes(10));

        return $accesses;
    }

    public function getUserAccesses(string $siteId, string $userId): ?Collection
    {
        // get cache key
        $cacheKey = CacheKey::getKeyAccess('getUserAccesses', $userId, $siteId);
        if (Cache::store($this->cacheStore)->has($cacheKey)) {
            return Cache::store($this->cacheStore)->get($cacheKey);
        }

        // get data access
        $data = Access::where([
            ['site_id', '=', $siteId],
            ['user_id', '=', $userId],
            ['is_allowed', '=', true],
        ])->pluck('code')->unique()->values();

        // cache it
        if (!empty($data)) {
            Cache::store($this->cacheStore)->put($cacheKey, $data, now()->addMinutes(10));
        }

        return $data;
    }
}
