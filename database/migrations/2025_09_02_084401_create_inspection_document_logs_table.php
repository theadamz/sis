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
        Schema::create('inspection_document_logs', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->unsignedBigInteger('inspection_document_id')->index();
            $table->unsignedBigInteger('user_id')->index();
            $table->text('description');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamp('created_at')->default('now()');

            // FK
            $table->foreign('inspection_document_id')->on('inspection_documents')->references('id')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('user_id')->on('users')->references('id')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_document_logs');
    }
};
