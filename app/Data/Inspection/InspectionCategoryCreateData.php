<?php

namespace App\Data\Inspection;

use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class InspectionCategoryCreateData extends Data
{
    public function __construct(
        public string $code,
        public string $name,
        public bool $is_active,
    ) {}

    public static function rules(): array
    {
        return [
            "code" => [new Required, new StringType, new Max(50), new Regex(config('setting.regxp.forCode'))],
            "name" => [new Required, new StringType, new Max(100)],
            "is_active" => [new Required, new BooleanType],
        ];
    }

    public static function prepareForPipeline(array $properties): array
    {
        return $properties;
    }
}
