<?php

namespace App\Helpers;

use App\Enums\CacheKey;
use Carbon\CarbonTimeZone;
use DateTimeZone;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redis;
use Jenssegers\Agent\Agent;
use Str;

class GeneralHelper
{

    public static function getMenuByCode(string $menuCode): ?Collection
    {
        return self::getMenuFromNestedByCode(collect(config('access.menus')), $menuCode);
    }

    public static function getMenuFromNestedByCode(Collection $menuData, string $menuCode): ?Collection
    {
        // loop $menuData
        foreach ($menuData as $menu) {
            // if menu found then return the data
            if ($menu['code'] === $menuCode) {
                return collect($menu);
            }

            // if menu children not empty then loop again this function
            if (!empty($menu['children'])) {
                $menu = self::getMenuFromNestedByCode(collect($menu['children']), $menuCode);

                // if menu empty then return it
                if (!empty($menu)) {
                    return $menu;
                }
            }
        }

        return null;
    }

    public static function getInfoIPPublic(): ?array
    {
        try {
            $request = Http::get('https://ipinfo.io/json');

            if ($request->status() === 200) {
                return $request->json();
            } else {
                return null;
            }
        } catch (\Exception $e) {
            return null;
        }
    }

    public static function removeCaches(string $keyword): void
    {
        // get all cache from redis
        if (config('cache.default') === 'database') {
            $cachePrefix = Cache::getPrefix();

            DB::table('cache')->where('key', 'like', $cachePrefix . $keyword . "%")->delete();
        } else {
            $keys = Redis::connection('cache')->keys('*' . Cache::getPrefix() . $keyword . '*');

            if (!empty($keys)) {
                foreach ($keys as $key) {
                    // refactor key name
                    $key = Str::chopStart($key, config('database.redis.options.prefix') . Cache::getPrefix());

                    Cache::forget($key);
                }
            }
        }
    }

    public static function getTimezones(): array
    {
        if (Cache::has(CacheKey::TIMEZONE->value)) {
            return Cache::get(CacheKey::TIMEZONE->value);
        }

        $data = [];
        $timezones = DateTimeZone::listIdentifiers(DateTimeZone::ALL);

        foreach ($timezones as $timezone) {
            $offset = round(CarbonTimeZone::create($timezone)->getOffset(now()) / 3600, 1);

            $data[] = [
                'value' => $timezone,
                'text' => '(' . CarbonTimeZone::create($timezone)->toOffsetName() . ') ' . $timezone,
                'offset' => $offset - floor($offset) > 0 ? $offset : (int) $offset,
            ];
        }

        Cache::put(CacheKey::TIMEZONE->value, $data, now()->addHours(24));

        return $data;
    }

    public static function getAgentInfo(): array
    {
        // init
        $request = app(Request::class);
        $agent = new Agent();

        // variables
        $url = $request->fullUrl();
        $method = $request->method();
        $body = $request->getContent();
        $ip = $request->getClientIp();
        $os = $agent->platform();
        $device = $agent->device();
        $device_type = $agent->deviceType();
        $browser = $agent->browser();
        $browser_version = $agent->version($browser);
        $user_agent = $agent->getUserAgent();
        $is_robot = $agent->robot();

        return compact('url', 'method', 'body', 'ip', 'os', 'browser', 'device', 'device_type', 'browser', 'browser_version', 'user_agent', 'is_robot');
    }

    public static function getRouteList(): array
    {
        // to return
        $data = collect();

        // get visible access menus
        $menus = collect(config('access.menus'))->where('visible', true);

        // loop menus
        foreach ($menus as $menu) {
            // if path and children empty then continue
            if (empty($menu['path']) && empty($menu['children'])) continue;

            // if path not empty then push
            if (!empty($menu['path'])) {
                $data->push($menu);
            }

            // get children
            if (!empty($menu['children'])) {
                $data = $data->merge(self::getRouteChildren(collect($menu['children'])));
            };
        }

        return $data->all();
    }

    private static function getRouteChildren(Collection $menus): array
    {
        // to return
        $data = collect();

        // get visible access menus
        $menus = $menus->where('visible', true);

        // loop menus
        foreach ($menus as $menu) {
            // if path and children empty then continue
            if (empty($menu['path']) && empty($menu['children'])) continue;

            // if path not empty then push
            if (!empty($menu['path'])) {
                $data->push($menu);
            }

            // get children
            if (!empty($menu['children'])) {
                $data = $data->merge(self::getRouteChildren(collect($menu['children'])));
            };
        }

        return $data->all();
    }
}
