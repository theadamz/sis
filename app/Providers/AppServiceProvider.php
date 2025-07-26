<?php

namespace App\Providers;

use App\Helpers\AccessHelper;
use App\Helpers\GeneralHelper;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\PersonalAccessToken;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{
    /**
     * All of the container singletons that should be registered.
     *
     * @var array
     */
    public $singletons = [
        'general' => GeneralHelper::class,
        'access' => AccessHelper::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {


        // define gate
        $accesses = config('access.lists');

        // loop $accesses
        foreach ($accesses as $access) {

            // loop $accesses
            foreach ($access['permissions'] as $permission) {
                Gate::define($access['code'], function () use ($access) {
                    if (!Auth::check()) {
                        return false;
                    }

                    return AccessHelper::hasAccess(Session::get('site_id'), Auth::id(), $access['code']);
                });

                Gate::define($access['code'] . '-' . $permission, function () use ($access, $permission) {
                    if (!Auth::check()) {
                        return false;
                    }

                    return AccessHelper::isAllowed(Session::get('site_id'), Auth::id(), $access['code'], $permission);
                });
            }
        }

        // sanctum
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
    }
}
