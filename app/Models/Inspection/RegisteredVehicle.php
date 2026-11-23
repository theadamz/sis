<?php

namespace App\Models\Inspection;

use App\Helpers\GeneralHelper;
use App\Models\Config\Setup\Site;
use CalebDW\Laraflake\Casts\AsSnowflake;
use CalebDW\Laraflake\Concerns\HasSnowflakes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class RegisteredVehicle extends Model
{
    use HasSnowflakes, LogsActivity;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];
    protected $casts = [
        'id' => AsSnowflake::class,
        'production_year' => 'int',
        'power_capacity' => 'int',
        'registration_year' => 'int',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (RegisteredVehicle $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (RegisteredVehicle $model) {
            $model->updated_by = Auth::id();
        });
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->setDescriptionForEvent(function (string $eventName) {
            return "Registerd vehicle " . $eventName;
        });
    }

    public function beforeActivityLogged(Activity $activity, string $eventName)
    {
        $activity->properties = $activity->properties->merge(GeneralHelper::getAgentInfo());
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }
}
