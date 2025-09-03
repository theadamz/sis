<?php

use App\Enums\InspectionFlow;
use App\Enums\InspectionStage;
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
            $table->uuid('id')->primary();
            $table->enum("flow", InspectionFlow::cases())->default(InspectionFlow::IN)->index();
            $table->enum("inspection_type", InspectionType::cases())->default(InspectionType::VHC_INS)->index();
            $table->string('code', 20)->unique();
            $table->string("name", 50);
            $table->boolean("use_eta_dest")->default(false)->comment("Flag to show Estimatin Time Arrival datetime in form inspection");
            $table->boolean("use_ata_dest")->default(false)->comment("Flag to show Actual Time Arrival datetime in form inspection");
            $table->boolean('is_publish')->default(true);
            $table->json("required_stages")->default(json_encode(InspectionStage::cases()));
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();
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
