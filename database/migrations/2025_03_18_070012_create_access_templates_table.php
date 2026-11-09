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
        Schema::create('access_templates', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('name', 50)->index();
            $table->unsignedBigInteger('site_id')->index();
            $table->string('code', 50)->index();
            $table->string('permission', 20);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            // FK
            $table->foreign('site_id')->on('sites')->references('id')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('access_templates');
    }
};
