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
        Schema::create('inspection_vehicle_form_sections', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->unsignedBigInteger("inspection_vehicle_form_id")->index();
            $table->string("description", 200);
            $table->smallInteger("seq")->default(1)->index();
            $table->boolean("is_separate_page")->default(true)->comment("flag print in new page");
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            // FK
            $table->foreign("inspection_vehicle_form_id")->references("id")->on("inspection_vehicle_forms")->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_vehicle_form_sections');
    }
};
