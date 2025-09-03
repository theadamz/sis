<?php

namespace App\Models\Inspection;

use App\Helpers\GeneralHelper;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\Contracts\Activity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class InspectionForm extends Model
{
    use HasUuids, LogsActivity;

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

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->setDescriptionForEvent(function (string $eventName) {
            return "gate " . $eventName;
        });
    }

    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->properties = $activity->properties->merge(GeneralHelper::getAgentInfo());
    }

    public function inspection_form_sections(): HasMany
    {
        return $this->hasMany(InspectionFormSection::class);
    }

    public function inspection_form_items(): HasManyThrough
    {
        return $this->HasManyThrough(InspectionFormItem::class, InspectionFormSection::class, 'inspection_form_id', 'inspection_form_section_id', 'id', 'id');
    }
}
