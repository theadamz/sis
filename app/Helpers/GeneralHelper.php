<?php

namespace App\Helpers;

use Carbon\CarbonTimeZone;
use DateTimeZone;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redis;
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
        $keys = Redis::connection('cache')->keys('*' . Cache::getPrefix() . $keyword . '*');

        if (!empty($keys)) {
            foreach ($keys as $key) {
                // refactor key name
                $key = Str::chopStart($key, config('database.redis.options.prefix') . Cache::getPrefix());

                Cache::forget($key);
            }
        }
    }

    public static function getTimezones(): array
    {
        $data = [];
        $timezones = DateTimeZone::listIdentifiers(DateTimeZone::ALL);

        foreach ($timezones as $timezone) {
            $data[] = [
                'value' => $timezone,
                'text' => '(' . CarbonTimeZone::create($timezone)->toOffsetName() . ') ' . $timezone,
            ];
        }

        return $data;
    }
}
