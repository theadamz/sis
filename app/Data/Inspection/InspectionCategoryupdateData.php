<?php

namespace App\Data\Inspection;

use CalebDW\Laraflake\Rules\Snowflake;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class InspectionCategoryupdateData extends Data
{
    public function __construct(
        public string $id,
        public string $code,
        public string $name,
        public bool $is_active,
    ) {}

    public static function rules(): array
    {
        return [
            "id" => [new Required, new Snowflake, new Exists("inspection_categories", "id")],
            "code" => [new Required, new StringType, new Max(50), new Regex(config('setting.regxp.forCode'))],
            "name" => [new Required, new StringType, new Max(100)],
            "is_active" => [new Required, new BooleanType],
        ];
    }

    public static function prepareForPipeline(array $properties): array
    {
        $properties['id'] = request()->route('id');

        return $properties;
    }
}
