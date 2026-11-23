<?php

use Illuminate\Support\Facades\Route;

// vehicle
Route::prefix("vehicles")->group(function () {
    Route::middleware(['can:ins-vch-reg', 'access:ins-vch-reg'])->group(function () {
        Route::get('/registered-vehicles', [\App\Http\Controllers\Inspection\RegisteredVehicleController::class, 'index'])->name('inspection.vehicle.registered-vehicle.index');
        Route::post('/registered-vehicles', [\App\Http\Controllers\Inspection\RegisteredVehicleController::class, 'store'])->can('ins-vch-reg-create')->name('inspection.vehicle.registered-vehicle.store');
        Route::get('/registered-vehicles/create', [\App\Http\Controllers\Inspection\RegisteredVehicleController::class, 'create'])->can('ins-vch-reg-create')->name('inspection.vehicle.registered-vehicle.create');
        Route::get('/registered-vehicles/{id}/edit', [\App\Http\Controllers\Inspection\RegisteredVehicleController::class, 'edit'])->can('ins-vch-reg-edit')->name('inspection.vehicle.registered-vehicle.edit');
        Route::get('/registered-vehicles/{id}/duplicate', [\App\Http\Controllers\Inspection\RegisteredVehicleController::class, 'duplicate'])->can('ins-vch-reg-create')->name('inspection.vehicle.registered-vehicle.duplicate');
        Route::put('registered-vehicles/{id}', [\App\Http\Controllers\Inspection\RegisteredVehicleController::class, 'update'])->can('ins-vch-reg-edit')->name('inspection.vehicle.registered-vehicle.update');
        Route::delete('/registered-vehicles', [\App\Http\Controllers\Inspection\RegisteredVehicleController::class, 'destroy'])->can('ins-vch-reg-delete')->name('inspection.vehicle.registered-vehicle.destroy');
    });

    Route::middleware(['can:ins-vch', 'access:ins-vch'])->group(function () {
        Route::get('/', [\App\Http\Controllers\Inspection\VehicleInspectionController::class, 'index'])->name('inspection.vehicle.index');
        Route::get('/create', [\App\Http\Controllers\Inspection\VehicleInspectionController::class, 'create'])->can('ins-vch-create')->name('inspection.vehicle.create');
        Route::get('/{id}', [\App\Http\Controllers\Inspection\VehicleInspectionController::class, 'show'])->name('inspection.vehicle.show');
        Route::post('/', [\App\Http\Controllers\Inspection\VehicleInspectionController::class, 'store'])->can('ins-vch-create')->name('inspection.vehicle.store');
        Route::put('/{id}', [\App\Http\Controllers\Inspection\VehicleInspectionController::class, 'update'])->can('ins-vch-edit')->name('inspection.vehicle.update');
        Route::delete('/', [\App\Http\Controllers\Inspection\VehicleInspectionController::class, 'destroy'])->can('ins-vch-delete')->name('inspection.vehicle.destroy');
    });
});
