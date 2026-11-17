<?php

namespace App\Data\Inspection;

use CalebDW\Laraflake\Rules\Snowflake;
use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class InspectionFlowUpdateData extends Data
{
    public function __construct(
        public string $id,
        public string $inspection_category_id,
        public string $name,
        public ?string $description,
        public array $stages,
    ) {}

    public static function rules(): array
    {
        return [
            "id" => [new Required, new Snowflake, new Exists("inspection_flows", "id")],
            "inspection_category_id" => [new Required, new Snowflake, new Exists("inspection_categories", "id")],
            "name" => [new Required, new StringType, new Max(100)],
            "description" => [new Nullable, new StringType, new Max(255)],
            "stages" => [new Required, new ArrayType],
            "stages.*.id" => [new Required, new Snowflake, new Exists("inspection_flow_stages", "id")],
            "stages.*.inspection_flow_id" => [new Required, new Snowflake],
            "stages.*.name" => [new Required, new StringType, new Max(200)],
            "stages.*.order" => [new Required, new IntegerType],
        ];
    }

    public static function prepareForPipeline(array $properties): array
    {
        $properties['id'] = request()->route('id');

        return $properties;
    }
}
