<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'site_id' => $this->site_id,
            'site_name' => $this->site->name,
            'code' => $this->code,
            'name' => $this->name,
            'is_active' => $this->is_active,
        ];
    }
}
