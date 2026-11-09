<?php

namespace App\Models\Config;

use CalebDW\Laraflake\Casts\AsSnowflake;
use CalebDW\Laraflake\Concerns\HasSnowflakes;
use Illuminate\Database\Eloquent\Model;

class SignInHistory extends Model
{
    use HasSnowflakes;

    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $guarded = ['created_at'];
    protected $casts = [
        'id' => AsSnowflake::class,
        'created_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (SignInHistory $model) {
            $model->created_at = now();
        });
    }
}
