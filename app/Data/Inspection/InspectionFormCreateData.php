<?php

namespace App\Data\Inspection;

use App\Enums\InspectionCheckType;
use App\Enums\InspectionFlow;
use App\Enums\InspectionStage;
use App\Enums\InspectionType;
use Illuminate\Support\Facades\Auth;
use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Uuid;
use Spatie\LaravelData\Data;

class InspectionFormCreateData extends Data
{
    public function __construct(
        public string $flow,
        public string $inspection_type,
        public string $code,
        public string $name,
        public bool $use_eta_dest,
        public bool $use_ata_dest,
        public bool $is_publish,
        public array $required_stages,
        public array $inspections,
    ) {}

    public static function authorize(): bool
    {
        return Auth::check();
    }

    public static function rules(): array
    {
        return [
            "flow" => [new Required, new StringType, new In(collect(InspectionFlow::cases())->pluck('value')->toArray())],
            "inspection_type" => [new Required, new StringType, new In(collect(InspectionType::cases())->pluck('value')->toArray())],
            "code" => [new Required, new StringType, new Max(20), new Regex(config('setting.regxp.forCode'))],
            "name" => [new Required, new StringType, new Max(50)],
            "use_eta_dest" => [new Required, new BooleanType],
            "use_ata_dest" => [new Required, new BooleanType],
            "is_publish" => [new Required, new BooleanType],
            "required_stages" => [new Required, new ArrayType],
            "required_stages.*" => [new Required, new In(collect(InspectionStage::cases())->pluck('value')->toArray())],
            "inspections" => [new Required, new ArrayType],
            "inspections.*.id" => [new Required, new Uuid],
            "inspections.*.inspection_form_id" => [new Required, new Uuid],
            "inspections.*.stage" => [new Required, new In(collect(InspectionStage::cases())->pluck('value')->toArray())],
            "inspections.*.description" => [new Required, new StringType, new Max(100)],
            "inspections.*.seq" => [new Required, new IntegerType],
            "inspections.*.is_separate_page" => [new Required, new BooleanType],
            "inspections.*.items" => [new Required, new ArrayType],
            "inspections.*.items.*.id" => [new Required, new Uuid],
            "inspections.*.items.*.inspection_form_section_id" => [new Required, new Uuid],
            "inspections.*.items.*.description" => [new Required, new StringType, new Max(100)],
            "inspections.*.items.*.type" => [new Required, new In(collect(InspectionCheckType::cases())->pluck('value')->toArray())],
            "inspections.*.items.*.seq" => [new Required, new IntegerType],
        ];
    }

    public static function prepareForPipeline(array $properties): array
    {
        return $properties;
    }
}
