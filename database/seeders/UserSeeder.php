<?php

namespace Database\Seeders;

use App\Models\Config\Setup\Site;
use App\Models\Config\Setup\SiteAccess;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // create dummy users
        $this->createDefaultUsers();

        // create dummy user
        // $this->createDummyUsers();
    }

    private function createDefaultUsers(): void
    {
        User::create([
            'id' => '00000000-0000-0000-0000-000000000000',
            'username' => 'dev',
            'email' => 'theadamz91@gmail.com',
            'name' => 'Developer',
            'password' => '12345678',
            'def_path' => '/dashboard',
            'site_id' => '00000000-0000-0000-0000-000000000000',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        User::create([
            'id' => '00000000-0000-0000-0000-000000000001',
            'username' => 'administrator',
            'email' => 'adam.malik@busanagroup.com',
            'name' => 'Administrator',
            'password' => '12345678',
            'def_path' => '/dashboard',
            'site_id' => '00000000-0000-0000-0000-000000000000',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $this->createSiteAccesses();
    }

    private function createSiteAccesses(): void
    {
        // get users
        $users = User::all();

        // get business unit
        $sites = Site::all();

        // loop user
        foreach ($users as $user) {

            // loop business units
            foreach ($sites as $unit) {
                SiteAccess::create([
                    'site_id' => $unit->id,
                    'user_id' => $user->id,
                    'is_allowed' => true
                ]);
            }
        }
    }

    private function createDummyUsers(): void
    {
        for ($i = 0; $i < 30; $i++) {
            $email = fake()->email();

            User::create([
                'username' => $email,
                'email' => $email,
                'name' => fake()->name(),
                'password' => '12345678',
                'def_path' => '/dashboard',
                'site_id' => '00000000-0000-0000-0000-000000000000',
                'is_active' => true,
                'email_verified_at' => now(),
            ]);
        }
    }
}
