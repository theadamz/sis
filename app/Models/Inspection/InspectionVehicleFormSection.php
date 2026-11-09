<?php

namespace App\Models\Inspection;

use App\Helpers\GeneralHelper;
use CalebDW\Laraflake\Concerns\HasSnowflakes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\Contracts\Activity;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class InspectionVehicleFormSection extends Model
{
    use HasSnowflakes, LogsActivity;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];
    protected $casts = [
        'seq' => 'integer',
        'is_separate_page' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (InspectionVehicleFormSection $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (InspectionVehicleFormSection $model) {
            $model->updated_by = Auth::id();
        });
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->setDescriptionForEvent(function (string $eventName) {
            return "inspection vehicle form section " . $eventName;
        });
    }

    public function beforeActivityLogged(Activity $activity, string $eventName)
    {
        $activity->properties = $activity->properties->merge(GeneralHelper::getAgentInfo());
    }

    public function inspection_vehicle_form(): BelongsTo
    {
        return $this->belongsTo(InspectionVehicleForm::class);
    }

    public function inspection_vehicle_form_items(): HasMany
    {
        return $this->hasMany(InspectionVehicleFormItem::class);
    }
}
