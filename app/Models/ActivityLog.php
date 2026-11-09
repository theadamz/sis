<?php

namespace App\Models;

use CalebDW\Laraflake\Casts\AsSnowflake;
use CalebDW\Laraflake\Concerns\HasSnowflakes;
use Spatie\Activitylog\Models\Activity;

class ActivityLog extends Activity
{
    use HasSnowflakes;

    public $incrementing = false;
    protected $keyType = 'string';
    public $guarded = [];
    protected $casts = [
        'id' => AsSnowflake::class,
    ];
}
