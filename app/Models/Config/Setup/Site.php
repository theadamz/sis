<?php

namespace App\Models\Config\Setup;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class Site extends Model
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

        static::creating(function (Site $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (Site $model) {
            $model->updated_by = Auth::id();
        });
    }

    public function entity(): BelongsTo
    {
        return $this->belongsTo(Entity::class);
    }
}
