<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => redirect()->to('login'))->name('home');

Route::middleware(['auth', 'access:dashboard', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// options
Route::prefix('options')->middleware(['auth'])->group(function () {
    Route::get('configs/users', [\App\Http\Controllers\Config\UserController::class, 'options'])->name('option.config.user');
    Route::get('configs/setup/sites', [\App\Http\Controllers\Config\Setup\SiteController::class, 'options'])->name('option.config.setup.site');
});

// cfg - config
Route::prefix('configs')->middleware(['auth'])->group(base_path('routes/web_config.php'));

// datatable
Route::prefix('dt')->middleware(['auth'])->group(base_path('routes/web_dt.php'));

require_once base_path('routes/settings.php');
require_once base_path('routes/auth.php');
