<?php

namespace App\Data\Config;

use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Auth;
use Spatie\LaravelData\Attributes\Validation\AlphaDash;
use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Uuid;
use Spatie\LaravelData\Data;

class UserAccessCreateData extends Data
{
    public function __construct(
        public string $site,
        public string $user,
        public array $access_lists,
    ) {}

    public static function authorize(): bool
    {
        return Auth::check();
    }

    public static function rules(): array
    {
        return [
            "site" => [new Required, new Uuid, new Exists(table: "sites", column: "id", where: function (Builder $query) {
                $query->where('is_active', true);
            })],
            "user" => [new Required, new Uuid, new Exists(table: "users", column: "id", where: function (Builder $query) {
                $query->where('is_active', true);
            })],
            "access_lists" => [new Required, new ArrayType],
            "access_lists.*" => [new Required, new AlphaDash, new Max(50), new In(collect(config('access.lists'))->pluck("code")->toArray())],
        ];
    }
}
