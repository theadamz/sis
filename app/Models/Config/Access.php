<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Access extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];
    protected $casts = [
        'is_allowed' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Access $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (Access $model) {
            $model->updated_by = Auth::id();
        });
    }
}
