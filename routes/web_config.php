<?php

use Illuminate\Support\Facades\Route;

Route::get('/accesses/menus', [\App\Http\Controllers\Config\AccessController::class, 'getMenu'])->middleware(['auth'])->name('accesses.menu');

// setup
Route::prefix("setup")->group(function () {
    // entity
    Route::middleware(['can:cfg-stp-entity', 'access:cfg-stp-entity'])->group(function () {
        Route::get('/entities', [\App\Http\Controllers\Config\Setup\EntityController::class, 'index'])->name('config.setup.entity.index');
        Route::get('/entities/{id}', [\App\Http\Controllers\Config\Setup\EntityController::class, 'show'])->name('config.setup.entity.show');
        Route::post('/entities', [\App\Http\Controllers\Config\Setup\EntityController::class, 'store'])->name('config.setup.entity.store');
        Route::put('/entities/{id}', [\App\Http\Controllers\Config\Setup\EntityController::class, 'update'])->name('config.setup.entity.update');
        Route::delete('/entities', [\App\Http\Controllers\Config\Setup\EntityController::class, 'destroy'])->name('config.setup.entity.destroy');
    });

    // site
    Route::middleware(['can:cfg-stp-site', 'access:cfg-stp-site'])->group(function () {
        Route::get('/sites', [\App\Http\Controllers\Config\Setup\SiteController::class, 'index'])->name('config.setup.site.index');
        Route::get('/sites/{id}', [\App\Http\Controllers\Config\Setup\SiteController::class, 'show'])->name('config.setup.site.show');
        Route::post('/sites', [\App\Http\Controllers\Config\Setup\SiteController::class, 'store'])->name('config.setup.site.store');
        Route::put('/sites/{id}', [\App\Http\Controllers\Config\Setup\SiteController::class, 'update'])->name('config.setup.site.update');
        Route::delete('/sites', [\App\Http\Controllers\Config\Setup\SiteController::class, 'destroy'])->name('config.setup.site.destroy');
    });

    // gate
    Route::middleware(['can:cfg-stp-gate', 'access:cfg-stp-gate'])->group(function () {
        Route::get('/gates', [\App\Http\Controllers\Config\Setup\GateController::class, 'index'])->name('config.setup.gate.index');
        Route::get('/gates/{id}', [\App\Http\Controllers\Config\Setup\GateController::class, 'show'])->name('config.setup.gate.show');
        Route::post('/gates', [\App\Http\Controllers\Config\Setup\GateController::class, 'store'])->name('config.setup.gate.store');
        Route::put('/gates/{id}', [\App\Http\Controllers\Config\Setup\GateController::class, 'update'])->name('config.setup.gate.update');
        Route::delete('/gates', [\App\Http\Controllers\Config\Setup\GateController::class, 'destroy'])->name('config.setup.gate.destroy');
    });
});

// inspection
Route::prefix("inspections")->group(function () {
    // vehicle type
    Route::middleware(['can:cfg-ins-vhc-type', 'access:cfg-ins-vhc-type'])->group(function () {
        Route::get('/vehicle-types', [\App\Http\Controllers\Config\Inspection\VehicleTypeController::class, 'index'])->name('config.inspection.vehicle-type.index');
        Route::get('/vehicle-types/{id}', [\App\Http\Controllers\Config\Inspection\VehicleTypeController::class, 'show'])->name('config.inspection.vehicle-type.show');
        Route::post('/vehicle-types', [\App\Http\Controllers\Config\Inspection\VehicleTypeController::class, 'store'])->name('config.inspection.vehicle-type.store');
        Route::put('/vehicle-types/{id}', [\App\Http\Controllers\Config\Inspection\VehicleTypeController::class, 'update'])->name('config.inspection.vehicle-type.update');
        Route::delete('/vehicle-types', [\App\Http\Controllers\Config\Inspection\VehicleTypeController::class, 'destroy'])->name('config.inspection.vehicle-type.destroy');
    });
});

// user
Route::middleware(['can:cfg-user', 'access:cfg-user'])->group(function () {
    Route::get('/users', [\App\Http\Controllers\Config\UserController::class, 'index'])->name('config.user.index');
    Route::get('/users/{id}', [\App\Http\Controllers\Config\UserController::class, 'show'])->name('config.user.show');
    Route::post('/users', [\App\Http\Controllers\Config\UserController::class, 'store'])->can('cfg-user-create')->name('config.user.store');
    Route::put('/users/{id}', [\App\Http\Controllers\Config\UserController::class, 'update'])->can('cfg-user-edit')->name('config.user.update');
    Route::delete('/users', [\App\Http\Controllers\Config\UserController::class, 'destroy'])->can('cfg-user-delete')->name('config.user.destroy');
});

// access
Route::middleware(['can:cfg-user-access', 'access:cfg-user-access'])->group(function () {
    Route::get('/accesses', [\App\Http\Controllers\Config\AccessController::class, 'index'])->name('config.access.index');
    Route::get('/accesses/{siteId}/{userId}', [\App\Http\Controllers\Config\AccessController::class, 'retriveUserAccesses'])->can('cfg-user-access-read')->name('config.access.get-user-access');
    Route::get('/accesses/{siteId}/{userId}/{accessCode}', [\App\Http\Controllers\Config\AccessController::class, 'show'])->can('cfg-user-access-read')->name('config.access.read');
    Route::post('/accesses', [\App\Http\Controllers\Config\AccessController::class, 'store'])->can('cfg-user-access-create')->name('config.access.store');
    Route::put('/accesses', [\App\Http\Controllers\Config\AccessController::class, 'update'])->can('cfg-user-access-edit')->name('config.access.update');
    Route::delete('/accesses', [\App\Http\Controllers\Config\AccessController::class, 'destroy'])->can('cfg-user-access-delete')->name('config.access.destroy');
    Route::post('/accesses/duplicate', [\App\Http\Controllers\Config\AccessController::class, 'duplicate'])->can('cfg-user-access-create')->name('config.access.duplicate');
});
