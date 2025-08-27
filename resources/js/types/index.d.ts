import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { InspectionItemType, InspectionStage } from './enum';

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

export interface Access {
    code: string;
    name: string;
    permissions: string[];
}

export interface UserAccess {
    id: string;
    code: string;
    name: string;
    permision: string;
    is_allowed: boolean;
}

export interface InspectionType {
    id: string;
    code: string;
    name: string;
    is_visible: boolean;
}

export interface InspectionFormSection {
    id: string;
    inspection_form_id: string;
    stage: InspectionStage;
    description: string;
    order: number;
    is_separate_page: boolean;
}

export interface InspectionFormItem {
    id: string;
    inspection_form_section_id: string;
    description: string;
    type: InspectionItemType;
    order: number;
}

/* Option */
export interface SiteOption {
    id: string;
    entity_id: string;
    code: string;
    name: string;
    entity: {
        id: string;
        code: string;
        name: string;
    };
}

export interface UserOption {
    id: string;
    username: string;
    name: string;
    email: string;
}

/* Datatable */
export interface EntityDT {
    id: string;
    code: string;
    name: string;
    description: string;
    is_active: boolean;
}

export interface SiteDT {
    id: string;
    entity_id: string;
    entity_name: string;
    code: string;
    name: string;
    address: string;
    timezone: string;
    is_active: boolean;
    entity?: Entity;
}

export interface GateDT {
    id: string;
    site_id: string;
    site_name: string;
    code: string;
    name: string;
    is_active: boolean;
}

export interface InspectionTypeDT {
    id: string;
    code: string;
    name: string;
    is_visible: boolean;
}

export interface InspectionFormDT {
    id: string;
    flow: string;
    inspection_type_id: string;
    inspection_type_name: string;
    code: string;
    name: string;
    use_eta_dest: boolean;
    use_ata_dest: boolean;
    is_public: boolean;
    required_stages: string[];
    inspection_form_categories_count: number;
    inspection_form_checks_count: number;
}

export interface UserDT {
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
