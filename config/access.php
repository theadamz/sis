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
        /* Configuration */
        ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-stp', 'code' => 'cfg-stp', 'name' => 'Setup', 'description' => 'Menu Parent Config > Setup', 'path' => null, 'icon' => 'cog', 'visible' => true, 'children' => [
            ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-stp', 'code' => 'cfg-stp-entity', 'name' => 'Entities', 'description' => 'Entity Management', 'path' => '/configs/setup/entities', 'icon' => 'building-2', 'visible' => true, 'children' => null],
            ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-stp', 'code' => 'cfg-stp-site', 'name' => 'Sites', 'description' => 'Site Management', 'path' => '/configs/setup/sites', 'icon' => 'building', 'visible' => true, 'children' => null],
            ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-stp', 'code' => 'cfg-stp-gate', 'name' => 'Gates', 'description' => 'Gate Management', 'path' => '/configs/setup/gates', 'icon' => 'door-open', 'visible' => true, 'children' => null],
        ]],
        ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-user', 'code' => 'cfg-user', 'name' => 'Users', 'description' => 'User Management', 'path' => '/configs/users', 'icon' => 'users', 'visible' => true, 'children' => null],
        ['group_code' => 'cfg', 'parent_menu_code' => 'cfg-user-access', 'code' => 'cfg-user-access', 'name' => 'User Accesses', 'description' => 'User Access Management', 'path' => '/configs/accesses', 'icon' => 'shield-check', 'visible' => true, 'children' => null],

        /* Basic */
        ['group_code' => 'bsc', 'parent_menu_code' => 'bsc-ins-frm', 'code' => 'bsc-ins-frm', 'name' => 'Inspection Forms', 'description' => 'Basic > Inspection Forms', 'path' => null, 'icon' => 'inspection-panel', 'visible' => true, 'children' => [
            ['group_code' => 'bsc', 'parent_menu_code' => 'bsc-ins-frm', 'code' => 'bsc-ins-frm-vch', 'name' => 'Vehicle', 'description' => 'Basic > Inspection Forms > Vehicle', 'path' => '/basic/inspection-forms/vehicles', 'icon' => 'car', 'visible' => true, 'children' => null],
            ['group_code' => 'bsc', 'parent_menu_code' => 'bsc-ins-frm', 'code' => 'bsc-ins-frm-area', 'name' => 'Area/Room/Location', 'description' => 'Basic > Inspection Forms > Area/Room/Location', 'path' => '/basic/inspection-forms/areas', 'icon' => 'house', 'visible' => true, 'children' => null],
        ]],

        /* Dashboard */
        ['group_code' => 'dsh', 'parent_menu_code' => 'dashboard', 'code' => 'dashboard', 'name' => 'Dashboard', 'description' => 'dashboard', 'path' => '/dashboard', 'icon' => 'circle-gauge', 'visible' => true, 'children' => null],

        /* Inspection */
        ['group_code' => 'ins', 'parent_menu_code' => 'ins-vehicle', 'code' => 'ins-vehicle', 'name' => 'Vehicles', 'description' => 'Inspection Vehicles', 'path' => '/inspections/vehicles', 'icon' => 'bus-front', 'visible' => true, 'children' => null],
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
        ['code' => 'cfg-stp', 'name' => 'Menu Configuration - Setup', 'permissions' => ['read']],
        ['code' => 'cfg-stp-entity', 'name' => 'Menu Configuration - Setup - Entities', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'cfg-stp-site', 'name' => 'Menu Configuration - Setup - Sites', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'cfg-stp-gate', 'name' => 'Menu Configuration - Setup - Gates', 'permissions' => ['read', 'create', 'edit', 'delete']],

        ['code' => 'cfg-user', 'name' => 'Menu Configuration - Users', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'cfg-user-access', 'name' => 'Menu Configuration - User Accesses', 'permissions' => ['read', 'create', 'edit', 'delete']],

        /* ./ Configuration */

        /* Basic - Inspection */
        ['code' => 'bsc-ins-frm', 'name' => 'Menu Basic - Inspection Form', 'permissions' => ['read']],
        ['code' => 'bsc-ins-frm-vch', 'name' => 'Menu Basic - Inspection Form - Vehicle', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'bsc-ins-frm-area', 'name' => 'Menu Basic - Inspection Form - Area/Room/Location', 'permissions' => ['read', 'create', 'edit', 'delete']],

        /* ./ Basic - Inspection */

        /* Dashboard */
        ['code' => 'dashboard', 'name' => 'Menu Dashboard', 'permissions' => ['read']],

        /* Inspection */
        ['code' => 'ins-vehicle', 'name' => 'Menu Inspection List', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'ins-monitor', 'name' => 'Menu Inspection Monitor', 'permissions' => ['read']],

        /* Report */
        ['code' => 'rpt-list', 'name' => 'Menu Report List', 'permissions' => ['read']],
    ]
];
