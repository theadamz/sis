<?php

use App\Enums\InspectionCheckType;
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
        Schema::create('inspection_form_checks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('inspection_form_category_id')->index();
            $table->string('description', 100);
            $table->enum('type', InspectionCheckType::cases())->default("select")->comment("select (ok/no) / photo");
            $table->smallInteger("order")->default(1);
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            // FK
            $table->foreign("inspection_form_category_id")->references("id")->on("inspection_form_categories")->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_form_checks');
    }
};
