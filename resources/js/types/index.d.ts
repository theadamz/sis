import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { InspectionItemType } from './enum';
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

export interface InspectionFormSection {
    id: string;
    inspection_vehicle_form_id: string;
    description: string;
    seq: number;
    is_separate_page: boolean;
}

export interface InspectionFormItem {
    id: string;
    inspection_vehicle_form_section_id: string;
    description: string;
    item_type: InspectionItemType;
    seq: number;
}

export interface InspectionFormItemMove {
    inspection_vehicle_form_section_id: string;
    to_inspection_vehicle_form_section_id: string;
    description: string;
    item_type: InspectionItemType;
    seq: number;
}

export interface InspectionCategory {
    id: string;
    code: string;
    name: string;
    is_active: boolean;
}

export interface InspectionFlowStage {
    id: string;
    inspection_flow_id: string;
    name: string;
    order: number;
}

export interface InspectionFlow {
    id: string;
    inspection_category_id: string;
    inspection_category_name: string;
    name: string;
    description?: string;
    stages: Array<InspectionFlowStage>;
}

export interface RegisteredVehicle {
    id: string;
    ownership: string;
    reg_no: string;
    owner_name?: string;
    owner_address?: string;
    paper_no?: string;
    brand?: string;
    type?: string;
    category?: string;
    model?: string;
    production_year?: number;
    power_capacity?: number;
    chassis_no?: string;
    engine_no?: string;
    color?: string;
    fuel_type?: string;
    license_plat_color?: string;
    registration_year?: number;
    registered_for?: string;
}

/* enum */

export interface InspectionType {
    value: string;
    name: string;
    label: string;
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

export interface InspectionCategoryDT {
    id: string;
    code: string;
    name: string;
    is_visible: boolean;
}

export interface InspectionFlowDT {
    id: string;
    name: string;
    description?: string;
}

export interface InspectionTypeDT {
    id: string;
    code: string;
    name: string;
    is_visible: boolean;
}

export interface InspectionFormDT {
    id: string;
    inspection_flow_stage: string;
    inspection_flow_stage_name: string;
    inspection_flow: string;
    inspection_flow_name: string;
    inspection_category: string;
    inspection_category_name: string;
    code: string;
    name: string;
    use_eta_dest: boolean;
    use_ata_dest: boolean;
    use_duration: boolean;
    is_publish: boolean;
    total_sections: number;
    total_items: number;
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

export interface VehicleInspectionDT {
    id: string;
    inspection_date: Date;
    inspection_form_id: string;
    inspection_form_name: string;
    inspected_by: string;
    inspected_by_name: string;
    gate_id: string;
    gate_name: string;
    container_no?: string;
    seal_no?: string;
    vehicle_reg_no: string;
    vehicle_paper_no?: string;
    driver_id_no: string;
    arrival_time_at_fty?: Date;
    depart_time_from_fty?: Date;
    eta_to_dest?: Date;
    ata_to_dest?: Date;
    duration_start?: Date;
    duration_end?: Date;
    export_notified_by?: string;
    remarks?: string;
    inspection_started_at?: Date;
    inspection_ended_at?: Date;
    coordinate_start?: any;
    coordinate_end?: any;
    reviewed_by?: string;
    reviewed_name?: string;
    reviewed_at?: Date;
    reviewed_comment?: string;
}

export interface RegisteredVehicleDT {
    id: string;
    ownership: string;
    reg_no: string;
    brand?: string;
    type?: string;
    category?: string;
    model?: string;
    chassis_no?: string;
    engine_no?: string;
    color?: string;
    registered_for?: string;
}
