import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface Group {
    code: string;
    name: string;
    icon: string;
}

export interface Menu {
    group_code: string;
    parent_menu_code: string;
    code: string;
    name: string;
    path: string;
    icon: string;
    children: null | Menu[];
}

export interface Permission {
    read: boolean;
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
    validation?: boolean;
}

export interface ConfigApp {
    url: string;
    locale: string;
    date_format: string;
    time_format: string;
    datetime_format: string;
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface Permission {
    read: boolean;
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
    validation?: boolean;
}

export interface AccessMenu {
    menu: Menu;
    permissions: Permission;
}

export type Flash = {
    alert?: {
        icon: string;
        variant: string;
        title: string;
        message: string;
    };
    toast?: {
        variant: string;
        title: string;
        message: string;
    };
    message?: string;
};

export interface SharedData {
    access: AccessMenu;
    auth: Auth;
    config: ConfigApp;
    name: string;
    name_short: string;
    ziggy: Config & { location: string };
    flash: Flash;
    prev_url: string;
    [key: string]: unknown;
}

export interface User {
    username: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    def_path: string;
    site_name: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Quote {
    message: string;
    author: string;
}

export interface Timezone {
    value: string;
    text: string;
}

/* Config */
export interface Entity {
    id: string;
    code: string;
    name: string;
    description: string;
    is_active: boolean;
}

export interface Site {
    id: string;
    entity_id: string;
    entity_name: string;
    code: string;
    name: string;
    address: string;
    timezone: string;
    is_active: boolean;
}

export interface Gate {
    id: string;
    site_id: string;
    site_name: string;
    code: string;
    name: string;
    is_active: boolean;
}

export interface VehicleType {
    id: string;
    code: string;
    name: string;
    is_visible: boolean;
}

export interface User {
    id: string;
    username: string;
    email: string;
    name: string;
    def_path: string;
    site_id: string;
    site_name: string;
    entity_id: string;
    entity_name: string;
    is_active: boolean;
    last_login_at: Date;
}
