<?php

namespace App\Models\Sanctum;

use App\Enums\CacheKey;
use App\Enums\QueueType;
use CalebDW\Laraflake\Concerns\HasSnowflakes;
use Illuminate\Database\Eloquent\Attributes\WithoutIncrementing;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

#[WithoutIncrementing]
class PersonalAccessToken extends SanctumPersonalAccessToken
{
    use HasSnowflakes;

    public static function findToken($token)
    {
        $token = Cache::remember(CacheKey::PAT->value . "::" . $token, now()->addMinutes(10), function () use ($token) {
            return parent::findToken($token) ?? '_null_';
        });

        if ($token === '_null_') {
            return null;
        }

        return $token;
    }

    public function getTokenableAttribute()
    {
        return Cache::remember(CacheKey::PAT->value . "::{$this->id}::tokenable", now()->addMinutes(10), function () {
            return parent::tokenable()->first();
        });
    }

    public static function boot()
    {
        parent::boot();

        // When updating, cancel normal update and manually update
        // the table asynchronously every hour.
        static::updating(function (self $personalAccessToken) {
            try {
                $time = now();

                Cache::remember(CacheKey::PAT->value . "::lastUsgeUpdate", now()->addHours(1), function () use ($personalAccessToken, $time) {
                    // update personal_access_tokens
                    dispatch(function () use ($personalAccessToken, $time) {
                        DB::table($personalAccessToken->getTable())->where('id', $personalAccessToken->id)
                            ->update([
                                'updated_at' => $time,
                                'last_used_at' => $time,
                            ]);
                    })->onQueue(QueueType::PAT->value);

                    return $time;
                });
            } catch (\Exception $e) {
                Log::channel('app-track')->error(500 . " - Internal Server Error", ['trace' => get_class($this), 'message' => $e->getMessage(), 'uri' => request()->getUri(), 'body' => request()->all(), 'header' => request()->headers->all()]);
            }
            return false;
        });
    }
}
