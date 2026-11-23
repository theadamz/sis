<?php

namespace App\Models\Inspection;

use App\Models\User;
use CalebDW\Laraflake\Casts\AsSnowflake;
use CalebDW\Laraflake\Concerns\HasSnowflakes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InspectionDocumentLog extends Model
{
    use HasSnowflakes;

    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $guarded = ['created_at'];
    protected $casts = [
        'id' => AsSnowflake::class,
        'inspection_document_id' => AsSnowflake::class,
        'user_id' => AsSnowflake::class,
        'created_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (InspectionDocumentLog $model) {
            $model->created_at = now();
        });
    }

    public function inspection_document(): BelongsTo
    {
        return $this->belongsTo(InspectionDocument::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
