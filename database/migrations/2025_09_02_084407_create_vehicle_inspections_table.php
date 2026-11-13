<?php

use App\Enums\InspectionStage;
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
        Schema::create('vehicle_inspections', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('inspection_no', 50)->unique();
            $table->date('inspection_date')->index();
            $table->unsignedBigInteger('inspection_form_id')->index();
            $table->unsignedBigInteger('inspected_by')->index();
            $table->unsignedBigInteger('gate_id')->index();
            $table->string('container_no', 100)->index()->nullable();
            $table->string('seal_no', 100)->index()->nullable();
            $table->string('vehicle_reg_no', 50)->index()->comment("Vehicle registration number");
            $table->string('vehicle_paper_no', 50)->nullable()->comment("Vehicle registration number paper");
            $table->string('driver_id_no', 50)->comment("Driver identity card ex: driver license");
            $table->string('driver_name', 100);
            $table->string('driver_phone_no', 20);
            $table->timestamp('arrival_time_at_fty')->nullable()->comment("Time arrived in factory to loading / unloading");
            $table->timestamp('depart_time_from_fty')->nullable()->comment("Time depart from factory to export");
            $table->timestamp('eta_to_dest')->nullable()->comment("Estimation time to destination harbour / airport");
            $table->timestamp('ata_to_dest')->nullable()->comment("Actual time arrived at destination harbour / airport");
            $table->timestamp('duration_start')->nullable();
            $table->timestamp('duration_end')->nullable();
            $table->string('export_notified_by', 100)->nullable()->comment("Notified to Export Departure by (name)");
            $table->string('remarks')->nullable();
            $table->string('stage', 20)->default(InspectionStage::CHECKED_IN)->index()->comment("CHECKED_IN/LOADING/CHECKED_OUT");
            $table->timestamp('inspection_started_at')->nullable();
            $table->timestamp('inspection_ended_at')->nullable();
            $table->jsonb('coordinate_start')->nullable();
            $table->jsonb('coordinate_end')->nullable();
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('reviewed_comment')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            // FK
            $table->foreign('inspection_form_id')->references('id')->on('inspection_forms')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('inspected_by')->references('id')->on('users')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('gate_id')->references('id')->on('gates')->restrictOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_inspections');
    }
};
