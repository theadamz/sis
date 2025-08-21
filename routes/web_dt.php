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

    // inspection
    Route::prefix("inspection")->group(function () {
        Route::get('/types', [\App\Http\Controllers\Config\Inspection\InspectionTypeController::class, 'datatable'])->name('dt.config.inspection.type');
        Route::get('/forms', [\App\Http\Controllers\Config\Inspection\InspectionFormController::class, 'datatable'])->name('dt.config.inspection.form');
    });

    Route::get('/users', [\App\Http\Controllers\Config\UserController::class, 'datatable'])->name('dt.config.user');
});
