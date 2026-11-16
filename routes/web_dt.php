<?php

use Illuminate\Support\Facades\Route;

// configs
Route::prefix("config")->group(function () {
    // setup
    Route::prefix("setup")->group(function () {
        Route::get('/entities', [\App\Http\Controllers\Config\Setup\EntityController::class, 'datatable'])->name('dt.config.setup.entity');
        Route::get('/sites', [\App\Http\Controllers\Config\Setup\SiteController::class, 'datatable'])->name('dt.config.setup.site');
        Route::get('/gates', [\App\Http\Controllers\Config\Setup\GateController::class, 'datatable'])->name('dt.config.setup.gate');
    });

    // inspection
    Route::prefix('inspections')->group(function () {
        Route::get('/flows', [\App\Http\Controllers\Inspection\InspectionFlowController::class, 'datatable'])->name('dt.config.inspection.flow');
        Route::get('/categories', [\App\Http\Controllers\Inspection\InspectionCategoryController::class, 'datatable'])->name('dt.config.inspection.category');
        Route::get('/forms/vehicles', [\App\Http\Controllers\Inspection\InspectionFormController::class, 'datatable'])->name('dt.config.inspection.form.vehicle');
    });

    Route::get('/users', [\App\Http\Controllers\Config\UserController::class, 'datatable'])->name('dt.config.user');
});
