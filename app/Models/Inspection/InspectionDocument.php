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

class InspectionDocument extends Model
{
    use HasSnowflakes, LogsActivity;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];
    protected $casts = [
        'id' => AsSnowflake::class,
        'site_id' => AsSnowflake::class,
        'inspection_flow_id' => AsSnowflake::class,
        'current_inspection_flow_stage_id' => AsSnowflake::class,
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (InspectionDocument $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (InspectionDocument $model) {
            $model->updated_by = Auth::id();
        });
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->setDescriptionForEvent(function (string $eventName) {
            return "inspection document " . $eventName;
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

    public function inspection_flow(): BelongsTo
    {
        return $this->belongsTo(InspectionFlow::class);
    }

    public function inspection_flow_current(): BelongsTo
    {
        return $this->belongsTo(InspectionFlow::class, 'current_inspection_flow_stage_id', 'id');
    }
}
