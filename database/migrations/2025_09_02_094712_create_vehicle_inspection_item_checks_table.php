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
            $table->uuid('id')->primary();
            $table->uuid('inspection_id')->index();
            $table->uuid('inspection_form_item_id')->index();
            $table->json('check')->comment("{ select: ok/no, photo:filename.jpg}");
            $table->string('remarks', 100)->nullable();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            // unique
            $table->unique(['inspection_id', 'inspection_form_item_id']);

            // FK
            $table->foreign('inspection_id')->references('id')->on('vehicle_inspections')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('inspection_form_item_id')->references('id')->on('inspection_form_items')->restrictOnDelete()->cascadeOnUpdate();
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
