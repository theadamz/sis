<?php

namespace App\Models\Inspection;

use App\Helpers\GeneralHelper;
use CalebDW\Laraflake\Casts\AsSnowflake;
use CalebDW\Laraflake\Concerns\HasSnowflakes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\Contracts\Activity;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class InspectionForm extends Model
{
    use HasSnowflakes, LogsActivity;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];
    protected $casts = [
        'id' => AsSnowflake::class,
        'is_publish' => 'boolean',
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
            return "inspection form " . $eventName;
        });
    }

    public function beforeActivityLogged(Activity $activity, string $eventName)
    {
        $activity->properties = $activity->properties->merge(GeneralHelper::getAgentInfo());
    }

    public function inspection_vehicle_form(): HasOne
    {
        return $this->hasOne(InspectionVehicleForm::class);
    }

    public function inspection_vehicle_form_sections(): HasManyThrough
    {
        return $this->HasManyThrough(InspectionVehicleFormSection::class, InspectionVehicleForm::class, 'inspection_form_id', 'inspection_vehicle_form_id', 'id', 'id');
    }
}
