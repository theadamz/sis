<?php

namespace App\Http\Requests\Config\Setup;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class SiteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'entity' => ['required', 'uuid', Rule::exists("entities", "id")],
            'code' => ['required', 'string', 'min:1', "max:6"],
            'name' => ['required', 'string', 'min:3', "max:50"],
            'address' => ['nullable', 'string', "max:150"],
            'timezone' => ['required', 'timezone:all'],
            'is_active' => ["required", "boolean"],
        ];

        // update
        if (in_array($this->method(), ["PUT", "PATCH"])) {
            $rules = array_merge($rules, [
                "id" => ["required", "uuid", Rule::exists("sites", "id")],
            ]);
        }

        return $rules;
    }

    protected function prepareForValidation(): void
    {
        // update
        if (in_array($this->method(), ["PUT", "PATCH"])) {
            $this->merge([
                'id' => $this->route('id')
            ]);
        }
    }
}
