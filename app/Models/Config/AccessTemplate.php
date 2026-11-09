<?php

namespace App\Models\Config;

use CalebDW\Laraflake\Casts\AsSnowflake;
use CalebDW\Laraflake\Concerns\HasSnowflakes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AccessTemplate extends Model
{
    use HasSnowflakes;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];
    protected $casts = [
        'id' => AsSnowflake::class,
        'is_allowed' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (AccessTemplate $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (AccessTemplate $model) {
            $model->updated_by = Auth::id();
        });
    }
}
