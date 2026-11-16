<?php

namespace Database\Seeders;

use App\Models\Inspection\InspectionCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InspectionCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $records = [
            ['code' => 'MT', 'name' => 'Motor', 'is_active' => true],
            ['code' => 'WB', 'name' => 'Wingbox', 'is_active' => true],
            ['code' => 'TR', 'name' => 'Trailer', 'is_active' => true],
            ['code' => 'GU', 'name' => 'Gudang', 'is_active' => true],
            ['code' => 'RG', 'name' => 'Ruangan', 'is_active' => true],
            ['code' => 'GE', 'name' => 'Gedung', 'is_active' => true],
        ];

        foreach ($records as $key => $record) {
            InspectionCategory::create($record);
        }
    }
}
