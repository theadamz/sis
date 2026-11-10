<?php

namespace Database\Seeders;

use App\Models\Config\Setup\Site;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Site::create([
            'id' => 1000000000000000001,
            'entity_id' => 1000000000000000001,
            'code' => 'DMY',
            'name' => 'Dummy',
            'address' => 'Address Dummy',
            'timezone' => 'Asia/Jakarta',
            'is_active' => true,
        ]);
    }
}
