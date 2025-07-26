<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\GeneralHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Config\SignInHistory;
use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Jenssegers\Agent\Agent;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // authenticate
        $request->authenticate();

        // generate new session
        $request->session()->regenerate();

        // get user info
        $user = Auth::user()->with(['site:id,name,timezone,entity_id', 'site.entity:id,name'])->first(['site_id', 'def_path']);

        // set session
        // save store
        $sessionStore = [
            'def_path' => $user->def_path,
            'site_id' => $user->site_id,
            'site_name' => $user->site->name,
            'entity_id' => $user->entity_id,
            'entity_name' => $user->site->entity->name,
            'timezone' => $user->site->timezone,
        ];
        session($sessionStore);

        // create sign in history
        $this->createSignInHistory();

        return redirect()->intended($user->def_path);
    }

    private function createSignInHistory(): void
    {
        // get ip address info and location
        $data = GeneralHelper::getInfoIPPublic();

        // variables
        $ip = empty($data) ? request()->getClientIp() : $data['ip'];
        $os = (new Agent)->getUserAgent();
        $platform = (new Agent)->platform();
        $browser = (new Agent)->browser();
        $country = empty($data) ? null : $data['country'];
        $city = empty($data) ? null : $data['city'];

        // create sign in history
        SignInHistory::create([
            'ip' => $ip,
            'os' => $os,
            'platform' => $platform,
            'browser' => $browser,
            'country' => $country,
            'city' => $city,
            'user_id' => Auth::id(),
            'created_at' => now()
        ]);

        // update last login
        $user = User::find(Auth::id());
        $user->last_login_at = now();
        $user->save();
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Inertia::clearHistory();

        return redirect('/');
    }
}
