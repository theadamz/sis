<?php

namespace App\Models\Inspection;

use App\Helpers\GeneralHelper;
use CalebDW\Laraflake\Casts\AsSnowflake;
use CalebDW\Laraflake\Concerns\HasSnowflakes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class InspectionVehicleForm extends Model
{
    use HasSnowflakes, LogsActivity;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];
    protected $casts = [
        'id' => AsSnowflake::class,
        'inspection_form_id' => AsSnowflake::class,
        'use_eta_dest' => 'boolean',
        'use_ata_dest' => 'boolean',
        'use_duration' => 'boolean',
        'is_publish' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (InspectionVehicleForm $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (InspectionVehicleForm $model) {
            $model->updated_by = Auth::id();
        });
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->setDescriptionForEvent(function (string $eventName) {
            return "inspection vehicle form " . $eventName;
        });
    }

    public function beforeActivityLogged(Activity $activity, string $eventName)
    {
        $activity->properties = $activity->properties->merge(GeneralHelper::getAgentInfo());
    }

    public function inspection_form(): HasOne
    {
        return $this->hasOne(InspectionForm::class);
    }

    public function inspection_vehicle_form_sections(): HasMany
    {
        return $this->hasMany(InspectionVehicleFormSection::class);
    }

    public function inspection_vehicle_form_items(): HasManyThrough
    {
        return $this->HasManyThrough(InspectionVehicleFormItem::class, InspectionVehicleFormSection::class, 'inspection_vehicle_form_id', 'inspection_vehicle_form_section_id', 'id', 'id');
    }
}
