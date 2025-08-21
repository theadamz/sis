<?php

namespace Database\Seeders;

use App\Models\Inspection\InspectionType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InspectionTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        InspectionType::create([
            'code' => 'CNT',
            'name' => 'Container',
            'is_visible' => true,
        ]);

        InspectionType::create([
            'code' => 'TRCK',
            'name' => 'Truck',
            'is_visible' => true,
        ]);

        InspectionType::create([
            'code' => 'MTRCYCLE',
            'name' => 'Motorcycle',
            'is_visible' => true,
        ]);
    }
}
