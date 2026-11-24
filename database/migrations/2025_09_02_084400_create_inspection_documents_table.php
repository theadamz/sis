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
        Schema::create('inspection_documents', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->unsignedBigInteger('site_id')->index();
            $table->string('inspection_type', 20)->index();
            $table->string('inspection_no', 50)->unique();
            $table->date('inspection_date')->index();
            $table->unsignedBigInteger('inspection_flow_id')->index();
            $table->unsignedBigInteger('current_inspection_flow_stage_id')->index();
            $table->string('status', 20)->index()->comment('DRAFT,POSTED,DISCARDED,REVIEWED');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            // FK
            $table->foreign('site_id')->on('sites')->references('id')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('inspection_flow_id')->on('inspection_flows')->references('id')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('current_inspection_flow_stage_id')->on('inspection_flow_stages')->references('id')->restrictOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_documents');
    }
};
