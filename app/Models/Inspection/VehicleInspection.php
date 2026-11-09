<?php

namespace App\Models\Inspection;

use App\Helpers\GeneralHelper;
use CalebDW\Laraflake\Concerns\HasSnowflakes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\Contracts\Activity;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class VehicleInspection extends Model
{
    use HasSnowflakes, LogsActivity;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];
    protected $casts = [
        'inspection_date' => 'date',
        'arrival_time_at_fty' => 'datetime',
        'depart_time_from_fty' => 'datetime',
        'eta_to_dest' => 'datetime',
        'ata_to_dest' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (VehicleInspection $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (VehicleInspection $model) {
            $model->updated_by = Auth::id();
        });
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->setDescriptionForEvent(function (string $eventName) {
            return "vehicle inspection " . $eventName;
        });
    }

    public function beforeActivityLogged(Activity $activity, string $eventName)
    {
        $activity->properties = $activity->properties->merge(GeneralHelper::getAgentInfo());
    }
}
