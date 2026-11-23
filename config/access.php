<?php

return [
    'userIdExceptions' => [1000000000000000001, 1000000000000000002],
    'groups' => [
        ['code' => 'cfg', 'name' => 'Config', 'icon' => 'file-sliders', 'visible' => true],
        ['code' => 'bsc', 'name' => 'Basic', 'icon' => 'folder-open', 'visible' => true],
        ['code' => 'dsh', 'name' => 'Dashboard', 'icon' => 'layout-dashboard', 'visible' => true],
        ['code' => 'ins', 'name' => 'Inspection', 'icon' => 'search-check', 'visible' => true],
        ['code' => 'rpt', 'name' => 'Reports', 'icon' => 'scroll-text', 'visible' => true],
    ],
    'menus' => [
        /* Config */
        ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-stp', 'code' => 'cfg-stp', 'name' => 'Setup', 'description' => 'Menu Parent Config > Setup', 'path' => null, 'icon' => 'cog', 'visible' => true, 'children' => [
            ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-stp', 'code' => 'cfg-stp-entity', 'name' => 'Entities', 'description' => 'Entity Management', 'path' => '/config/setup/entities', 'icon' => 'building-2', 'visible' => true, 'children' => null],
            ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-stp', 'code' => 'cfg-stp-site', 'name' => 'Sites', 'description' => 'Site Management', 'path' => '/config/setup/sites', 'icon' => 'building', 'visible' => true, 'children' => null],
            ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-stp', 'code' => 'cfg-stp-gate', 'name' => 'Gates', 'description' => 'Gate Management', 'path' => '/config/setup/gates', 'icon' => 'door-open', 'visible' => true, 'children' => null],
        ]],
        ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-ins', 'code' => 'cfg-ins', 'name' => 'Inspections', 'description' => 'Config > Inspections', 'path' => null, 'icon' => 'inspection-panel', 'visible' => true, 'children' => [
            ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-ins', 'code' => 'cfg-ins-ctg', 'name' => 'Categories', 'description' => 'Config > Categories', 'path' => '/config/inspections/categories', 'icon' => 'grid-2x2', 'visible' => true, 'children' => null],
            ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-ins', 'code' => 'cfg-ins-flw', 'name' => 'Flows', 'description' => 'Config > Flows', 'path' => '/config/inspections/flows', 'icon' => 'arrow-up-1-0', 'visible' => true, 'children' => null],
            ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-ins', 'code' => 'cfg-ins-frm', 'name' => 'Forms', 'description' => 'Config > Inspections > Forms', 'path' => null, 'icon' => 'inspection-panel', 'visible' => true, 'children' => [
                ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-ins-frm', 'code' => 'cfg-ins-frm-vch', 'name' => 'Vehicles', 'description' => 'Config > Inspections > Forms > Vehicles', 'path' => '/config/inspections/forms/vehicles', 'icon' => 'bus-front', 'visible' => true, 'children' => null],
                ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-ins-frm', 'code' => 'cfg-ins-frm-area', 'name' => 'Areas', 'description' => 'Config > Inspections > Forms > Areas', 'path' => '/config/inspections/forms/areas', 'icon' => 'house', 'visible' => true, 'children' => null],
            ]],
        ]],
        ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-user', 'code' => 'cfg-user', 'name' => 'Users', 'description' => 'User Management', 'path' => '/config/users', 'icon' => 'users', 'visible' => true, 'children' => null],
        ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-user-access', 'code' => 'cfg-user-access', 'name' => 'User Accesses', 'description' => 'User Access Management', 'path' => '/config/accesses', 'icon' => 'shield-check', 'visible' => true, 'children' => null],

        /* Dashboard */
        ['group_code' => 'dsh', 'parent_menu_code' => 'dashboard', 'code' => 'dashboard', 'name' => 'Dashboard', 'description' => 'dashboard', 'path' => '/dashboard', 'icon' => 'circle-gauge', 'visible' => true, 'children' => null],

        /* Inspection */
        ['group_code' => 'ins', 'parent_menu_code' => 'ins-vch-reg', 'code' => 'ins-vch-reg', 'name' => 'Registered Vehicles', 'description' => 'Registered Vehicles', 'path' => '/inspections/vehicles/registered-vehicles', 'icon' => 'book-text', 'visible' => true, 'children' => null],
        ['group_code' => 'ins', 'parent_menu_code' => 'ins-vch-mnt', 'code' => 'ins-vch-mnt', 'name' => 'Monitor Vehicles', 'description' => 'Inspection Monitor Vehicles', 'path' => '/inspections/vehicles/monitor', 'icon' => 'scan-search', 'visible' => true, 'children' => null],
        ['group_code' => 'ins', 'parent_menu_code' => 'ins-vch', 'code' => 'ins-vch', 'name' => 'Vehicle Inspections', 'description' => 'Vehicle Inspections', 'path' => '/inspections/vehicles', 'icon' => 'bus-front', 'visible' => true, 'children' => null],
        ['group_code' => 'ins', 'parent_menu_code' => 'ins-area', 'code' => 'ins-area', 'name' => 'Area Inspections', 'description' => 'Area Inspections', 'path' => '/inspections/areas', 'icon' => 'map-pin-house', 'visible' => true, 'children' => null],

        /* Laporan */
        ['group_code' => 'rpt', 'parent_menu_code' => 'rpt-list', 'code' => 'rpt-list', 'name' => 'Report List', 'description' => 'Report List', 'path' => '/reports', 'icon' => 'circle-small', 'visible' => true, 'children' => null],
    ],
    'lists' => [
        /* access khusus */
        ['code' => 'as-approval', 'name' => 'Akses Approval Inspection', 'permissions' => ['approve']],
        ['code' => 'as-inspector', 'name' => 'Akses Inspection App (PWA)', 'permissions' => ['read']],

        /* Menu access */

        /* Config */

        /* Config - Setup */
        ['code' => 'cfg-stp', 'name' => 'Menu Config - Setup', 'permissions' => ['read']],
        ['code' => 'cfg-stp-entity', 'name' => 'Menu Config - Setup - Entities', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'cfg-stp-site', 'name' => 'Menu Config - Setup - Sites', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'cfg-stp-gate', 'name' => 'Menu Config - Setup - Gates', 'permissions' => ['read', 'create', 'edit', 'delete']],

        ['code' => 'cfg-ins', 'name' => 'Menu Config - Inspections', 'permissions' => ['read']],
        ['code' => 'cfg-ins-ctg', 'name' => 'Menu Config - Inspections - Categories', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'cfg-ins-flw', 'name' => 'Menu Config - Inspections - Flows', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'cfg-ins-frm', 'name' => 'Menu Config - Inspections - Forms', 'permissions' => ['read']],
        ['code' => 'cfg-ins-frm-vch', 'name' => 'Menu Config - Inspection - Forms - Vehicles', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'cfg-ins-frm-area', 'name' => 'Menu Config - Inspection - Forms - Areas', 'permissions' => ['read', 'create', 'edit', 'delete']],

        ['code' => 'cfg-user', 'name' => 'Menu Config - Users', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'cfg-user-access', 'name' => 'Menu Config - User Accesses', 'permissions' => ['read', 'create', 'edit', 'delete']],

        /* ./ Config */

        /* Dashboard */
        ['code' => 'dashboard', 'name' => 'Menu Dashboard', 'permissions' => ['read']],

        /* Inspection */
        ['code' => 'ins-vch-reg', 'name' => 'Menu Inspection - Registered Vehicles', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'ins-vch-mnt', 'name' => 'Menu Inspection - Monitor Vehicles', 'permissions' => ['read']],
        ['code' => 'ins-vch', 'name' => 'Menu Inspection - Vehicles', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'ins-area', 'name' => 'Menu Inspection - Areas', 'permissions' => ['read', 'create', 'edit', 'delete']],

        /* Report */
        ['code' => 'rpt-list', 'name' => 'Menu Report List', 'permissions' => ['read']],
    ]
];
