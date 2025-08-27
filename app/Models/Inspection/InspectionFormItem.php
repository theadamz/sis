<?php

namespace App\Models\Inspection;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class InspectionFormItem extends Model
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

        static::creating(function (InspectionFormItem $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (InspectionFormItem $model) {
            $model->updated_by = Auth::id();
        });
    }
}
