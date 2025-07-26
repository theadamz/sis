<?php

namespace App\Models\Config\Inspection;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class VehicleType extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];
    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (VehicleType $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (VehicleType $model) {
            $model->updated_by = Auth::id();
        });
    }
}
