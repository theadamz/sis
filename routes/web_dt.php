<?php

use Illuminate\Support\Facades\Route;

// configs
Route::prefix("configs")->group(function () {
    // setup
    Route::prefix("setup")->group(function () {
        Route::get('/entities', [\App\Http\Controllers\Config\Setup\EntityController::class, 'datatable'])->name('dt.config.setup.entity');
        Route::get('/sites', [\App\Http\Controllers\Config\Setup\SiteController::class, 'datatable'])->name('dt.config.setup.site');
        Route::get('/gates', [\App\Http\Controllers\Config\Setup\GateController::class, 'datatable'])->name('dt.config.setup.gate');
    });

    Route::get('/users', [\App\Http\Controllers\Config\UserController::class, 'datatable'])->name('dt.config.user');
});

// basic
Route::prefix("basic")->group(function () {
    // inspection form
    Route::prefix("inspection-forms")->group(function () {
        Route::get('/vehicles', [\App\Http\Controllers\Inspection\InspectionFormController::class, 'datatable'])->name('dt.basic.inspection-form.vehicle');
    });
});
