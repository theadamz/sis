<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => redirect()->to('login'))->name('home');

Route::middleware(['auth', 'access:dashboard', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// cfg - config
Route::prefix('configs')->middleware(['auth'])->group(base_path('routes/web_config.php'));

// datatable
Route::prefix('dt')->middleware(['auth'])->group(base_path('routes/web_dt.php'));

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
