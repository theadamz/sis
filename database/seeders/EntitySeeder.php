<?php

namespace Database\Seeders;

use App\Models\Config\Setup\Entity;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EntitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // delete all entities
        Entity::truncate();

        Entity::create([
            'id' => '00000000-0000-0000-0000-000000000000',
            'code' => 'DMY',
            'name' => 'Dummy',
            'description' => 'Description Dummy',
            'is_active' => true,
        ]);

        for ($i = 1; $i <= 999; $i++) {
            Entity::create([
                'code' => str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => 'Entity ' . $i,
                'description' => 'Description Entity ' . $i,
                'is_active' => true,
            ]);
        }
    }
}
