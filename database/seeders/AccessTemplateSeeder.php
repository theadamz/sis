<?php

namespace Database\Seeders;

use App\Models\Config\AccessTemplate;
use App\Models\Config\Setup\Site;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccessTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // get sites
        $siteIds = Site::all()->pluck('id');

        // delete all access template
        AccessTemplate::whereIn('site_id', $siteIds)->delete();

        // get permission list by code
        $accessList = collect(config('access.lists'));

        // looping $accessList
        foreach ($accessList as $access) {

            // get permissions
            $permissions = $access['permissions'];

            // looping $permissionLists
            foreach ($permissions as $permission) {

                // loop $sites
                foreach ($siteIds as $siteId) {
                    // create data
                    AccessTemplate::create([
                        'name' => "FULL ACCESS",
                        'site_id' => $siteId,
                        'code' => $access['code'],
                        'permission' => $permission,
                    ]);
                }
            }
        }
    }
}
