<?php

namespace Database\Seeders;

use App\Models\Config\Inspection\VehicleType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VehicleTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        VehicleType::create([
            'code' => 'CNT',
            'name' => 'Container',
            'is_visible' => true,
        ]);

        VehicleType::create([
            'code' => 'TRCK',
            'name' => 'Truck',
            'is_visible' => true,
        ]);

        VehicleType::create([
            'code' => 'MTRCYCLE',
            'name' => 'Motorcycle',
            'is_visible' => true,
        ]);
    }
}
