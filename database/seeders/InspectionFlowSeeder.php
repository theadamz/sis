<?php

namespace Database\Seeders;

use App\Models\Inspection\InspectionCategory;
use App\Models\Inspection\InspectionFlow;
use App\Models\Inspection\InspectionFlowStage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InspectionFlowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $records = [
            [
                'inspection_category_id' => 'MT',
                'name' => 'Motor Muat Barang',
                'orders' => [
                    ['name' => 'Loading', 'order' => 1],
                ]
            ],
            [
                'inspection_category_id' => 'WB',
                'name' => 'Wingbox Bongkar Barang',
                'orders' => [
                    ['name' => 'Check in', 'order' => 1],
                    ['name' => 'Unloading', 'order' => 2],
                    ['name' => 'Check out', 'order' => 3],
                ]
            ],
            [
                'inspection_category_id' => 'TR',
                'name' => 'Trailer Muat Barang',
                'orders' => [
                    ['name' => 'Check in', 'order' => 1],
                    ['name' => 'Loading', 'order' => 2],
                    ['name' => 'Check out', 'order' => 3],
                ]
            ],
            [
                'inspection_category_id' => 'GU',
                'name' => 'Pemeriksaan Gudang',
                'orders' => [
                    ['name' => 'Patroli', 'order' => 1],
                ]
            ],
        ];

        foreach ($records as $record) {
            $inspectionCategoryId = InspectionCategory::where('code', $record['inspection_category_id'])->value('id');

            $inspectionFlow = InspectionFlow::create([
                'inspection_category_id' => $inspectionCategoryId,
                'name' => $record['name'],
            ]);

            foreach ($record['orders'] as $order) {
                InspectionFlowStage::create([
                    'inspection_flow_id' => $inspectionFlow->id,
                    'name' => $order['name'],
                    'order' => $order['order'],
                ]);
            }
        }
    }
}
