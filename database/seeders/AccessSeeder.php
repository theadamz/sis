<?php

namespace Database\Seeders;

use App\Models\Config\Access;
use App\Models\Config\Setup\Site;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // get user ids
        $userIds = config('access.userIdExceptions');

        // get sites
        $sites = Site::all();

        // delete all access for userIds
        Access::whereIn('user_id', $userIds)->delete();

        // loop $userIds
        foreach ($userIds as $userId) {

            // get permission list by code
            $accessList = collect(config('access.lists'));

            // looping $accessList
            foreach ($accessList as $access) {

                // get permissions
                $permissions = $access['permissions'];

                // looping $permissionLists
                foreach ($permissions as $permission) {

                    // loop $sites
                    foreach ($sites as $site) {
                        // create data
                        Access::create([
                            'site_id' => $site->id,
                            'user_id' => $userId,
                            'code' => $access['code'],
                            'permission' => $permission,
                            'is_allowed' => true,
                        ]);
                    }
                }
            }
        }
    }
}
