<?php

namespace App\Data\Config;

use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Auth;
use Spatie\LaravelData\Attributes\Validation\AlphaDash;
use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Uuid;
use Spatie\LaravelData\Data;

class UserAccessDuplicateData extends Data
{
    public function __construct(
        public string $from_user,
        public string $to_user,
        public ?array $exclude_sites,
        public ?array $exclude_accesses,
    ) {}

    public static function authorize(): bool
    {
        return Auth::check();
    }

    public static function rules(): array
    {
        return [
            "from_user" => [new Required, new Uuid, new Exists(table: "users", column: "id", where: function (Builder $query) {
                $query->where('is_active', true);
            })],
            "to_user" => [new Required, new Uuid, new Exists(table: "users", column: "id", where: function (Builder $query) {
                $query->where('is_active', true);
            })],
            "exclude_sites" => [new Nullable, new ArrayType],
            "exclude_sites.*" => [new Nullable, new Uuid, new Exists(table: "users", column: "id")],
            "access_lists" => [new Nullable, new ArrayType],
            "access_lists.*" => [new Nullable, new AlphaDash, new Max(50), new In(collect(config('access.lists'))->pluck("code")->toArray())],
        ];
    }
}
