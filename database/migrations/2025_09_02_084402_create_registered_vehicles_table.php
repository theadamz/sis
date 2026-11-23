<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('registered_vehicles', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->unsignedBigInteger('site_id')->index();
            $table->string('ownership', 50)->index()->comment("internal,employee,vendor,forwarder/ekspeditur");
            $table->string("reg_no", 50)->index()->comment("Vehicle registration number");
            $table->string('owner_name')->nullable();
            $table->string('owner_address')->nullable();
            $table->string('paper_no')->nullable()->comment('Vehicle registration number paper');
            $table->string('brand')->nullable()->comment('Brand, ex: YAMAHA');
            $table->string('type')->nullable()->comment('Type, ex: 2DP NON ABS');
            $table->string('category')->nullable()->comment('Category, ex: SEPEDA MOTOR');
            $table->string('model')->nullable()->comment("Model, ex: SPD MOTOR SOLO");
            $table->smallInteger('production_year')->nullable();
            $table->integer('power_capacity')->nullable()->comment('cylinder capacity / electrical power');
            $table->string('chassis_no')->nullable()->index();
            $table->string('engine_no')->nullable()->index();
            $table->string('color')->nullable();
            $table->string('fuel_type')->nullable();
            $table->string('license_plate_color')->nullable();
            $table->smallInteger('registration_year')->nullable();
            $table->string('registered_for')->nullable()->comment("employee name or PIC for the vehicle");

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            // indexes
            $table->unique(['site_id', 'reg_no']);

            // FK
            $table->foreign('site_id')->on('sites')->references('id')->restrictOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registered_vehicles');
    }
};
