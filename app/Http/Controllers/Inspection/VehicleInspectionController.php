<?php

namespace App\Http\Controllers\Inspection;

use App\Enums\InspectionType;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleInspectionController extends Controller
{
    private array $inspectionTypes;

    public function __construct()
    {
        $this->inspectionTypes = collect(InspectionType::cases())->transform(function ($item) {
            $label = $item->getName();
            $item = (array) $item;

            return [
                ...$item,
                'label' => $label
            ];
        })->all();
    }

    public function index(): Response
    {
        return Inertia::render("inspection/vehicle-inspection/index")->with([
            'inspectionTypes' => $this->inspectionTypes
        ]);
    }
}
