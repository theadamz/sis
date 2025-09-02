<?php

namespace App\Models\Inspection;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class InspectionFormItem extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];
    protected $casts = [
        'order' => 'integer',
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

    public function inspection_form_section(): BelongsTo
    {
        return $this->belongsTo(InspectionFormSection::class);
    }
}
