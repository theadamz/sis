<?php

namespace App\Models\Inspection;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;

class InspectionForm extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];
    protected $casts = [
        'use_eta_dest' => 'boolean',
        'use_ata_dest' => 'boolean',
        'is_publish' => 'boolean',
        'required_stages' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (InspectionForm $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (InspectionForm $model) {
            $model->updated_by = Auth::id();
        });
    }

    public function inspection_type(): BelongsTo
    {
        return $this->belongsTo(InspectionType::class);
    }

    public function inspection_form_categories(): HasMany
    {
        return $this->hasMany(InspectionFormCategory::class);
    }

    public function inspection_form_checks(): HasMany
    {
        return $this->hasMany(InspectionFormCheck::class);
    }
}
