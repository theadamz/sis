<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'entity_id' => $this->entity_id,
            'entity_name' => $this->entity->name,
            'code' => $this->code,
            'name' => $this->name,
            'address' => $this->address,
            'timezone' => $this->timezone,
            'is_active' => $this->is_active,
        ];
    }
}
