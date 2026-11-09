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
        Schema::create('vehicle_inspection_item_checks', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->unsignedBigInteger('vehicle_inspection_id')->index();
            $table->unsignedBigInteger('inspection_vehicle_form_item_id')->index();
            $table->jsonb('result')->comment('{ is_passed: true/false, picture_file: "image.webp" }');
            $table->string('remarks', 100)->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            // unique
            $table->unique(['vehicle_inspection_id', 'inspection_vehicle_form_item_id']);

            // FK
            $table->foreign('vehicle_inspection_id')->references('id')->on('vehicle_inspections')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('inspection_vehicle_form_item_id')->references('id')->on('inspection_vehicle_form_items')->restrictOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_inspection_item_checks');
    }
};
