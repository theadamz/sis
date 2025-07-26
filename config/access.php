<?php

return [
    'userIdExceptions' => ['00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001'],
    'groups' => [
        ['code' => 'cfg', 'name' => 'Config', 'icon' => 'file-sliders', 'visible' => true],
        ['code' => 'dsh', 'name' => 'Dashboard', 'icon' => 'layout-dashboard', 'visible' => true],
        ['code' => 'bsc', 'name' => 'Basic', 'icon' => 'building', 'visible' => true],
        ['code' => 'ins', 'name' => 'Inspection', 'icon' => 'search-check', 'visible' => true],
        ['code' => 'rpt', 'name' => 'Reports', 'icon' => 'scroll-text', 'visible' => true],
    ],
    'menus' => [
        /* Configuration */
        ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-stp', 'code' => 'cfg-stp', 'name' => 'Setup', 'description' => 'Menu Parent Config > Setup', 'path' => null, 'icon' => 'cog', 'visible' => true, 'children' => [
            ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-stp', 'code' => 'cfg-stp-entity', 'name' => 'Entities', 'description' => 'Entity Management', 'path' => '/configs/setup/entities', 'icon' => 'building-2', 'visible' => true, 'children' => null],
            ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-stp', 'code' => 'cfg-stp-site', 'name' => 'Sites', 'description' => 'Site Management', 'path' => '/configs/setup/sites', 'icon' => 'building', 'visible' => true, 'children' => null],
            ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-stp', 'code' => 'cfg-stp-gate', 'name' => 'Gates', 'description' => 'Gate Management', 'path' => '/configs/setup/gates', 'icon' => 'door-open', 'visible' => true, 'children' => null],
        ]],
        ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-ins', 'code' => 'cfg-ins', 'name' => 'Inspection', 'description' => 'Menu Parent Config > Inspection', 'path' => null, 'icon' => 'inspection-panel', 'visible' => true, 'children' => [
            ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-ins', 'code' => 'cfg-ins-vhc-type', 'name' => 'Vehicle Types', 'description' => 'Vehicle Type Management', 'path' => '/configs/inspections/vehicle-types', 'icon' => 'bus', 'visible' => true, 'children' => null],
            ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-ins', 'code' => 'cfg-ins-form', 'name' => 'Forms', 'description' => 'Inspection Form Management', 'path' => '/configs/inspections/forms', 'icon' => 'file-text', 'visible' => true, 'children' => null],
        ]],
        ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-user', 'code' => 'cfg-user', 'name' => 'Users', 'description' => 'User Management', 'path' => '/configs/users', 'icon' => 'users', 'visible' => true, 'children' => null],
        ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-user-access', 'code' => 'cfg-user-access', 'name' => 'User Accesses', 'description' => 'User Access Management', 'path' => '/configs/accesses', 'icon' => 'shield-check', 'visible' => true, 'children' => null],

        /* Dashboard */
        ['group_code' => 'dsh', 'parent_menu_code' => 'dashboard', 'code' => 'dashboard', 'name' => 'Dashboard', 'description' => 'dashboard', 'path' => '/dashboard', 'icon' => 'circle-gauge', 'visible' => true, 'children' => null],

        /* Inspection */
        ['group_code' => 'ins', 'parent_menu_code' => 'ins-list', 'code' => 'ins-list', 'name' => 'List', 'description' => 'Inspection List', 'path' => '/inspections', 'icon' => 'list', 'visible' => true, 'children' => null],
        ['group_code' => 'ins', 'parent_menu_code' => 'ins-monitor', 'code' => 'ins-monitor', 'name' => 'Monitor', 'description' => 'Inspection Monitor', 'path' => '/inspections/monitor', 'icon' => 'scan-search', 'visible' => true, 'children' => null],

        /* Laporan */
        ['group_code' => 'rpt', 'parent_menu_code' => 'rpt-list', 'code' => 'rpt-list', 'name' => 'Report List', 'description' => 'Report List', 'path' => '/reports', 'icon' => 'circle-small', 'visible' => true, 'children' => null],
    ],
    'lists' => [
        /* access khusus */
        ['code' => 'as-approval', 'name' => 'Akses Approval Inspection', 'permissions' => ['approve']],
        ['code' => 'as-inspector', 'name' => 'Akses Inspection App (PWA)', 'permissions' => ['read']],

        /* Menu access */

        /* Configuration */

        /* Configuration - Setup */
        ['code' => 'cfg-stp', 'name' => 'Menu Configuration - Setup Parent', 'permissions' => ['read']],
        ['code' => 'cfg-stp-entity', 'name' => 'Menu Configuration - Setup - Entities', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'cfg-stp-site', 'name' => 'Menu Configuration - Setup - Sites', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'cfg-stp-gate', 'name' => 'Menu Configuration - Setup - Gates', 'permissions' => ['read', 'create', 'edit', 'delete']],

        /* Configuration - Inspection */
        ['code' => 'cfg-ins', 'name' => 'Menu Configuration - Inspection Parent', 'permissions' => ['read']],
        ['code' => 'cfg-ins-vhc-type', 'name' => 'Menu Configuration - Inspection - Vehicle Types', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'cfg-ins-form', 'name' => 'Menu Configuration - Inspection - Forms', 'permissions' => ['read', 'create', 'edit', 'delete']],

        ['code' => 'cfg-user', 'name' => 'Menu Configuration - Users', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'cfg-user-access', 'name' => 'Menu Configuration - User Accesses', 'permissions' => ['read', 'create', 'edit', 'delete']],

        /* ./ Configuration */

        /* Dashboard */
        ['code' => 'dashboard', 'name' => 'Menu Dashboard', 'permissions' => ['read']],

        /* Inspection */
        ['code' => 'ins-list', 'name' => 'Menu Inspection List', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'ins-monitor', 'name' => 'Menu Inspection Monitor', 'permissions' => ['read']],

        /* Report */
        ['code' => 'rpt-list', 'name' => 'Menu Report List', 'permissions' => ['read']],
    ]
];
