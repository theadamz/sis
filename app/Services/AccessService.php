<?php

namespace App\Services;

use App\Repositories\Contracts\AccessRepository;
use Illuminate\Support\Collection;

class AccessService
{
    // protected AccessRepository $repository;

    public function __construct(
        protected AccessRepository $repository
    ) {}

    public function hasAccess(string $siteId, string $userId, string $menuCode): bool
    {
        return $this->repository->hasAccess($siteId, $userId, $menuCode);
    }

    public function isAllowed(string $siteId, string $userId, string $menuCode, ?string $permission = 'read'): bool
    {
        return $this->repository->isAllowed($siteId, $userId, $menuCode, $permission);
    }

    public function getPermissions(string $siteId, string $userId, string $menuCode): ?Collection
    {
        return $this->repository->getPermissions($siteId, $userId, $menuCode);
    }

    public function getUserAccesses(string $siteId, string $userId): ?Collection
    {
        return $this->repository->getUserAccesses($siteId, $userId);
    }

    public function retiveAccessMenuByCodes(Collection $menuCodes): Collection
    {
        // get access menu from $menuCodes
        return collect(config('access.menus'))->whereIn('code', $menuCodes)->where('visible', true)
            ->transform(function (array $item, int $key) use ($menuCodes) {
                $item = collect($item);
                $children = collect($item->get('children'))->whereIn('code', $menuCodes)->where('visible', true);

                // if item has children
                if ($children->isNotEmpty()) {
                    $item['children'] = $this->retiveAccessMenuChildrenByCodes($menuCodes, $children);
                }

                return $item->only(['group_code', 'parent_menu_code', 'code', 'name', 'path', 'icon', 'children']);
            })->values();
    }

    public function retiveAccessMenuChildrenByCodes(Collection $menuCodes, Collection $childrenAccessMenus): Collection
    {
        return $childrenAccessMenus->transform(function (array $item, int $key) use ($menuCodes) {
            $item = collect($item);
            $children = collect($item->get('children'))->whereIn('code', $menuCodes)->where('visible', true);

            // if item has children
            if ($children->isNotEmpty()) {
                $item['children'] = $this->retiveAccessMenuChildrenByCodes($menuCodes, $children);
            }

            return $item->only(['group_code', 'parent_menu_code', 'code', 'name', 'path', 'icon', 'children']);
        })->values();
    }

    public function retriveMenuGroupsByMenuData(Collection $menuData): Collection
    {
        // variables
        $groupCodes = $menuData->pluck('group_code')->unique();

        // get grups info by menuCodes
        return collect(config('access.groups'))->whereIn('code', $groupCodes)->where('visible', true)->transform(function (array $item) {
            return collect($item)->only(['code', 'name', 'icon']);
        })->values();
    }
}
