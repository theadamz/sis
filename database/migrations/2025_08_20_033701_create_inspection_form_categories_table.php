<?php

use App\Enums\Stage;
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
        Schema::create('inspection_form_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid("inspection_form_id")->index();
            $table->enum("stage", Stage::cases())->default(Stage::CHECKED_IN)->index()->comment("CHECKED_IN/LOADING/CHECKED_OUT");
            $table->string("description", 100);
            $table->smallInteger("order")->default(1);
            $table->boolean("is_separate_page")->default(true)->comment("flag print in new page");
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            // FK
            $table->foreign("inspection_form_id")->references("id")->on("inspection_forms")->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_form_categories');
    }
};
