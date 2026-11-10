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
        Schema::create('inspection_vehicle_forms', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->unsignedBigInteger('inspection_form_id')->unique();
            $table->boolean('use_eta_dest')->default(false);
            $table->boolean('use_ata_dest')->default(false);
            $table->string('stage', 20)->default(InspectionStage::CHECKED_IN->value)->index();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            // indexes
            $table->unique(['inspection_form_id', 'stage'], $table->getTable() . '_unique');

            // FK
            $table->foreign('inspection_form_id')->references('id')->on('inspection_forms')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_vehicle_forms');
    }
};
