<?php

namespace App\Models\Config\Setup;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class SiteAccess extends Model
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

        static::creating(function (SiteAccess $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (SiteAccess $model) {
            $model->updated_by = Auth::id();
        });
    }
}
