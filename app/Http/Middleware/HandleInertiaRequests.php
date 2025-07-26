<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('setting.general.web_name'),
            'name_short' => config('setting.general.web_name_short'),
            'auth' => [
                'user' => Auth::check() ? [
                    'username' => $request->user()->username,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'def_path' => Session::get('def_path'),
                    'site_name' => Session::get('site_name'),
                ] : null,
            ],
            'config' => [
                'url' => url('/'),
                'locale' => config('setting.local.locale_short'),
                'date_format' => config('setting.local.js_date_format'),
                'time_format' => config('setting.local.js_time_format'),
                'datetime_format' => config('setting.local.js_datetime_format'),
            ],
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'alert' => fn() => $request->session()->get('alert'),
                'toast' => fn() => $request->session()->get('toast'),
            ]
        ];
    }
}
