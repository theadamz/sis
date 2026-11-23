<?php

use App\Enums\InspectionType;
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
        Schema::create('inspection_forms', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->unsignedBigInteger('inspection_flow_stage_id')->index();
            $table->string('inspection_type', 20)->default(InspectionType::VEHICLE)->index();
            $table->string('code', 50)->unique();
            $table->string('name', 100);
            $table->boolean('is_publish')->default(true);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            // FK
            $table->foreign('inspection_flow_stage_id')->on('inspection_flow_stages')->references('id')->restrictOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_forms');
    }
};
