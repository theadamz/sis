<?php

namespace App\Models\Inspection;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class InspectionFormCategory extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];
    protected $casts = [
        'order' => 'integer',
        'is_separate_page' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (InspectionFormCategory $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (InspectionFormCategory $model) {
            $model->updated_by = Auth::id();
        });
    }

    public function inspection_form(): BelongsTo
    {
        return $this->belongsTo(InspectionForm::class);
    }
}
