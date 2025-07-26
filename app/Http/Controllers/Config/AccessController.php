<?php

namespace App\Http\Controllers\Config;

use App\Http\Controllers\Controller;
use App\Services\AccessService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class AccessController extends Controller
{
    private string $cacheKey;

    public function __construct(
        protected AccessService $service
    ) {
        //
    }

    public function getMenu(): JsonResponse
    {
        // variables
        $menuData = [];
        $data = [
            'groups' => [],
            'menus' => [],
        ];
        $this->cacheKey = "MENU_" . Auth::id();

        // get from cache if production
        if (app()->isProduction()) {
            $menuData = Cache::get($this->cacheKey);
        }

        // if menuData null
        if (empty($menuData)) {
            // delete cache
            Cache::forget($this->cacheKey);

            // get access menu codes
            $menuData = $this->service->getUserAccesses(siteId: Session::get('site_id'), userId: Auth::id());

            // if menuData empty then 404
            if (empty($menuData)) {
                return response()->json(['message' => 'Not found.'])->setStatusCode(Response::HTTP_OK);
            }

            // get menus by parsing menu codes
            $menuData = $this->service->retiveAccessMenuByCodes($menuData);

            // set menus
            $data['menus'] = $menuData;

            // get group
            $menuGroupData = $this->service->retriveMenuGroupsByMenuData($menuData);

            // set menu group
            $data['groups'] = $menuGroupData;

            // set $menuData
            $menuData = $data;

            // save cache
            Cache::forever($this->cacheKey, $menuData);
        }

        return response()->json(['data' => $menuData, 'message' => 'OK'])->setStatusCode(Response::HTTP_OK);
    }
}
