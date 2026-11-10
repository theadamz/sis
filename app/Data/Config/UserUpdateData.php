<?php

namespace App\Data\Config;

use CalebDW\Laraflake\Rules\Snowflake;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Password;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class UserUpdateData extends Data
{
    public function __construct(
        public string $id,
        public string $email,
        public string $name,
        public ?string $password,
        public string $def_path,
        public string $site,
        public bool $is_active,
    ) {}

    public static function authorize(): bool
    {
        return Auth::check();
    }

    public static function rules(): array
    {
        $password = App::isProduction() ? new Password(min: 8, letters: true, mixedCase: true, numbers: true, symbols: true, uncompromised: true) : new Password(min: 8);

        return [
            "id" => [new Required, new Snowflake(), new Exists("users", "id")],
            "email" => [new Required, new Email, new Max(255)],
            "password" => [new Nullable, new Max(255), $password],
            "name" => [new Required, new StringType, new Max(255)],
            "def_path" => [new Required, new StringType],
            "site" => [new Required, new Snowflake(), new Exists(table: "sites", column: "id", where: function (Builder $query) {
                $query->where("is_active", true);
            })],
            "is_active" => [new Required, new BooleanType]
        ];
    }

    public static function prepareForPipeline(array $properties): array
    {
        $properties['id'] = request()->route('id');

        return $properties;
    }
}
