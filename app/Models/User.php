<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Helpers\GeneralHelper;
use App\Models\Config\Setup\Site;
use CalebDW\Laraflake\Casts\AsSnowflake;
use CalebDW\Laraflake\Concerns\HasSnowflakes;
use Illuminate\Database\Eloquent\Attributes\WithoutIncrementing;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Activitylog\Contracts\Activity;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

#[WithoutIncrementing]
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasSnowflakes, HasApiTokens, LogsActivity;

    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'name',
        'password',
        'def_path',
        'site_id',
        'is_active',
        'email_verified_at',
        'last_change_password_at',
        'last_login_at',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'id' => AsSnowflake::class,
            'site_id' => AsSnowflake::class,
            'password' => 'hashed',
            'is_active' => 'boolean',
            'email_verified_at' => 'datetime',
            'last_change_password_at' => 'datetime',
            'last_login_at' => 'datetime',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function (User $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (User $model) {
            $model->updated_by = Auth::id();
        });
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logExcept(['password', 'remember_token'])->setDescriptionForEvent(function (string $eventName) {
            return "user " . $eventName;
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
