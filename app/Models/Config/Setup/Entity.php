<?php

namespace App\Models\Config\Setup;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;

class Entity extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];
    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Entity $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (Entity $model) {
            $model->updated_by = Auth::id();
        });
    }

    public function sites(): HasMany
    {
        return $this->hasMany(Site::class);
    }
}
