<?php

namespace App\Models\Inspection;

use App\Helpers\GeneralHelper;
use CalebDW\Laraflake\Concerns\HasSnowflakes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        'use_eta_dest' => 'boolean',
        'use_ata_dest' => 'boolean',
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

    public function inspection_form(): BelongsTo
    {
        return $this->belongsTo(InspectionForm::class);
    }

    public function inspection_vehicle_form_sections(): HasMany
    {
        return $this->hasMany(InspectionVehicleFormSection::class);
    }
}
