<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AccessTemplate extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];

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
