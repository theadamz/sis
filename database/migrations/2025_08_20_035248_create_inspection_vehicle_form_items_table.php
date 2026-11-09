<?php

use App\Enums\InspectionItemType;
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
        Schema::create('inspection_vehicle_form_items', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->unsignedBigInteger('inspection_vehicle_form_section_id')->index();
            $table->string('description', 200);
            $table->string('item_type', 20)->default(InspectionItemType::SELECT->value)->index();
            $table->smallInteger("seq")->default(1);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            // indexes
            $table->unique(['inspection_vehicle_form_section_id', 'seq'], $table->getTable() . '_unique');

            // FK
            $table->foreign("inspection_vehicle_form_section_id")->references("id")->on("inspection_vehicle_form_sections")->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_vehicle_form_items');
    }
};
