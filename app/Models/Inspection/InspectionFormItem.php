<?php

namespace App\Models\Inspection;

use App\Helpers\GeneralHelper;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\Contracts\Activity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class InspectionFormItem extends Model
{
    use HasUuids, LogsActivity;

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

    public function inspection_form_section(): BelongsTo
    {
        return $this->belongsTo(InspectionFormSection::class);
    }
}
