<?php

namespace Database\Seeders;

use App\Models\Config\Setup\Gate;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Gate::create([
            'site_id' => '00000000-0000-0000-0000-000000000000',
            'code' => 'DMY',
            'name' => 'Dummy Gate',
            'is_active' => true,
        ]);
    }
}
