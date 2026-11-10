<?php

use Illuminate\Support\Facades\Route;

// vehicle
Route::prefix("inspection-forms")->group(function () {
    // vehicle type
    Route::middleware(['can:bsc-ins-frm', 'access:bsc-ins-frm-vch'])->group(function () {
        Route::get('/vehicles', [\App\Http\Controllers\Inspection\InspectionFormController::class, 'index'])->name('basic.inspection-form.vehicle.index');
        Route::get('/vehicles/{id}/edit', [\App\Http\Controllers\Inspection\InspectionFormController::class, 'edit'])->can('bsc-ins-frm-vch-edit')->name('basic.inspection-form.vehicle.edit');
        Route::get('/vehicles/create', [\App\Http\Controllers\Inspection\InspectionFormController::class, 'create'])->can('bsc-ins-frm-vch-create')->name('basic.inspection-form.vehicle.create');
        // Route::get('/forms/{id}', [\App\Http\Controllers\Inspection\InspectionFormController::class, 'show'])->name('basic.inspection-form.vehicle.show');
        Route::post('/vehicles', [\App\Http\Controllers\Inspection\InspectionFormController::class, 'store'])->can('bsc-ins-frm-vch-create')->name('basic.inspection-form.vehicle.store');
        Route::put('/vehicles/{id}', [\App\Http\Controllers\Inspection\InspectionFormController::class, 'update'])->can('bsc-ins-frm-vch-edit')->name('basic.inspection-form.vehicle.update');
        Route::delete('/vehicles', [\App\Http\Controllers\Inspection\InspectionFormController::class, 'destroy'])->can('bsc-ins-frm-vch-delete')->name('basic.inspection-form.vehicle.destroy');
    });
});
