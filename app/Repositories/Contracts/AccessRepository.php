<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface AccessRepository
{
    public function hasAccess(string $siteId, string $userId, string $menuCode): bool;
    public function isAllowed(string $siteId, string $userId, string $menuCode, ?string $permission = 'read'): bool;
    public function getPermissions(string $siteId, string $userId, string $menuCode): ?Collection;
    public function getUserAccesses(string $siteId, string $userId): ?Collection;
}
