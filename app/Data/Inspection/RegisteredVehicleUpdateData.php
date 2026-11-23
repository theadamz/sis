<?php

namespace App\Data\Inspection;

use App\Enums\VehicleOwnership;
use CalebDW\Laraflake\Rules\Snowflake;
use Illuminate\Support\Facades\Session;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\Required;


class RegisteredVehicleUpdateData extends Data
{
    public function __construct(
        public string $id,
        public string $ownership,
        public string $reg_no,
        public ?string $owner_name,
        public ?string $owner_address,
        public ?string $paper_no,
        public ?string $brand,
        public ?string $type,
        public ?string $category,
        public ?string $model,
        public ?int $production_year,
        public ?int $power_capacity,
        public ?string $chassis_no,
        public ?string $engine_no,
        public ?string $color,
        public ?string $fuel_type,
        public ?string $license_plate_color,
        public ?int $registration_year,
        public ?string $registered_for,
    ) {}

    public static function rules(): array
    {
        return [
            "id" => [new Required, new Snowflake, new Exists("registered_vehicles", "id", where: fn($query) => $query->where('site_id', Session::get('site_id')))],
            "ownership" => [new Required(), new StringType, new Max((50)), new In(collect(VehicleOwnership::cases())->pluck('value')->toArray())],
            "reg_no" => [new Required, new StringType, new Max(50), new Regex(config('setting.regxp.alphaNumberOnly'))],
            "owner_name" => [new Nullable, new StringType, new Max(255)],
            "owner_address" => [new Nullable, new StringType, new Max(255)],
            "paper_no" => [new Nullable, new StringType, new Max(255)],
            "brand" => [new Nullable, new StringType, new Max(255)],
            "type" => [new Nullable, new StringType, new Max(255)],
            "category" => [new Nullable, new StringType, new Max(255)],
            "model" => [new Nullable, new StringType, new Max(255)],
            "production_year" => [new Nullable, new IntegerType],
            "power_capacity" => [new Nullable, new IntegerType],
            "chassis_no" => [new Nullable, new StringType, new Max(255)],
            "engine_no" => [new Nullable, new StringType, new Max(255)],
            "color" => [new Nullable, new StringType, new Max(255)],
            "fuel_type" => [new Nullable, new StringType, new Max(255)],
            "license_plate_color" => [new Nullable, new StringType, new Max(255)],
            "registration_year" => [new Nullable, new IntegerType],
            "registered_for" => [new Nullable, new StringType, new Max(255)],
        ];
    }

    public static function prepareForPipeline(array $properties): array
    {
        $properties['id'] = request()->route('id');

        return $properties;
    }
}
