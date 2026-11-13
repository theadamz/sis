<?php

namespace App\Data\Inspection;

use App\Enums\InspectionItemType;
use App\Enums\InspectionStage;
use CalebDW\Laraflake\Rules\Snowflake;
use Illuminate\Support\Facades\Auth;
use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class InspectionFormCreateData extends Data
{
    public function __construct(
        public string $code,
        public string $name,
        public bool $use_eta_dest,
        public bool $use_ata_dest,
        public bool $use_duration,
        public bool $is_publish,
        public string $stage,
        public array $inspections,
    ) {}

    public static function authorize(): bool
    {
        return Auth::check();
    }

    public static function rules(): array
    {
        return [
            "code" => [new Required, new StringType, new Max(50), new Regex(config('setting.regxp.forCode'))],
            "name" => [new Required, new StringType, new Max(100)],
            "use_eta_dest" => [new Required, new BooleanType],
            "use_ata_dest" => [new Required, new BooleanType],
            "use_duration" => [new Required, new BooleanType],
            "is_publish" => [new Required, new BooleanType],
            "stage" => [new Required, new In(collect(InspectionStage::cases())->pluck('value')->toArray())],
            "inspections" => [new Required, new ArrayType],
            // "inspections.*.id" => [new Required, new Snowflake()],
            // "inspections.*.inspection_vehicle_form_id" => [new Required, new Snowflake()],
            "inspections.*.description" => [new Required, new StringType, new Max(200)],
            "inspections.*.seq" => [new Required, new IntegerType],
            "inspections.*.is_separate_page" => [new Required, new BooleanType],
            "inspections.*.items" => [new Required, new ArrayType],
            // "inspections.*.items.*.id" => [new Required, new Snowflake()],
            // "inspections.*.items.*.inspection_vehicle_form_section_id" => [new Required, new Snowflake()],
            "inspections.*.items.*.description" => [new Required, new StringType, new Max(200)],
            "inspections.*.items.*.item_type" => [new Required, new In(collect(InspectionItemType::cases())->pluck('value')->toArray())],
            "inspections.*.items.*.seq" => [new Required, new IntegerType],
        ];
    }

    public static function prepareForPipeline(array $properties): array
    {
        return $properties;
    }
}
