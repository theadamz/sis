<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property string $id
 * @property string|null $log_name
 * @property string $description
 * @property string|null $subject_type
 * @property int|null $subject_id
 * @property string|null $event
 * @property string|null $causer_type
 * @property int|null $causer_id
 * @property \Illuminate\Support\Collection<array-key, mixed>|null $attribute_changes
 * @property \Illuminate\Support\Collection<array-key, mixed>|null $properties
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model|null $causer
 * @property-read \Illuminate\Database\Eloquent\Model|null $subject
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog causedBy(\Illuminate\Database\Eloquent\Model $causer)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog forEvent(\Spatie\Activitylog\Enums\ActivityEvent|string $event)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog forSubject(\Illuminate\Database\Eloquent\Model $subject)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog inLog(\BackedEnum|array|string ...$logNames)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog whereAttributeChanges($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog whereCauserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog whereCauserType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog whereEvent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog whereLogName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog whereProperties($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog whereSubjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog whereSubjectType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityLog whereUpdatedAt($value)
 */
	class ActivityLog extends \Eloquent {}
}

namespace App\Models\Config{
/**
 * @property string $id
 * @property int $site_id
 * @property int $user_id
 * @property string $code
 * @property string $permission read,edit,delete,validation,etc
 * @property bool $is_allowed
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ActivityLog> $activitiesAsSubject
 * @property-read int|null $activities_as_subject_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Access newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Access newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Access query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Access whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Access whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Access whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Access whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Access whereIsAllowed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Access wherePermission($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Access whereSiteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Access whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Access whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Access whereUserId($value)
 */
	class Access extends \Eloquent {}
}

namespace App\Models\Config{
/**
 * @property string $id
 * @property string $name
 * @property int $site_id
 * @property string $code
 * @property string $permission
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccessTemplate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccessTemplate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccessTemplate query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccessTemplate whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccessTemplate whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccessTemplate whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccessTemplate whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccessTemplate whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccessTemplate wherePermission($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccessTemplate whereSiteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccessTemplate whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccessTemplate whereUpdatedBy($value)
 */
	class AccessTemplate extends \Eloquent {}
}

namespace App\Models\Config\Setup{
/**
 * @property string $id
 * @property string $code
 * @property string $name
 * @property string|null $description
 * @property bool $is_active
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ActivityLog> $activitiesAsSubject
 * @property-read int|null $activities_as_subject_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Config\Setup\Site> $sites
 * @property-read int|null $sites_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Entity newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Entity newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Entity query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Entity whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Entity whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Entity whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Entity whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Entity whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Entity whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Entity whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Entity whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Entity whereUpdatedBy($value)
 */
	class Entity extends \Eloquent {}
}

namespace App\Models\Config\Setup{
/**
 * @property string $id
 * @property int $site_id
 * @property string $code
 * @property string $name
 * @property bool $is_active
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ActivityLog> $activitiesAsSubject
 * @property-read int|null $activities_as_subject_count
 * @property-read \App\Models\Config\Setup\Site $site
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gate query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gate whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gate whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gate whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gate whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gate whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gate whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gate whereSiteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gate whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gate whereUpdatedBy($value)
 */
	class Gate extends \Eloquent {}
}

namespace App\Models\Config\Setup{
/**
 * @property string $id
 * @property int $entity_id
 * @property string $code
 * @property string $name
 * @property string|null $address
 * @property string $timezone
 * @property bool $is_active
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ActivityLog> $activitiesAsSubject
 * @property-read int|null $activities_as_subject_count
 * @property-read \App\Models\Config\Setup\Entity $entity
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site whereEntityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site whereTimezone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site whereUpdatedBy($value)
 */
	class Site extends \Eloquent {}
}

namespace App\Models\Config\Setup{
/**
 * @property string $id
 * @property int $site_id
 * @property int $user_id
 * @property bool $is_allowed
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ActivityLog> $activitiesAsSubject
 * @property-read int|null $activities_as_subject_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SiteAccess newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SiteAccess newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SiteAccess query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SiteAccess whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SiteAccess whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SiteAccess whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SiteAccess whereIsAllowed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SiteAccess whereSiteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SiteAccess whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SiteAccess whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SiteAccess whereUserId($value)
 */
	class SiteAccess extends \Eloquent {}
}

namespace App\Models\Config{
/**
 * @property string $id
 * @property string $ip
 * @property string|null $os
 * @property string|null $platform
 * @property string|null $browser
 * @property string|null $country
 * @property string|null $city
 * @property int $user_id
 * @property \Illuminate\Support\Carbon $created_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SignInHistory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SignInHistory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SignInHistory query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SignInHistory whereBrowser($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SignInHistory whereCity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SignInHistory whereCountry($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SignInHistory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SignInHistory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SignInHistory whereIp($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SignInHistory whereOs($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SignInHistory wherePlatform($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SignInHistory whereUserId($value)
 */
	class SignInHistory extends \Eloquent {}
}

namespace App\Models\Inspection{
/**
 * @property int $id
 * @property string $flow
 * @property string $inspection_type
 * @property string $code
 * @property string $name
 * @property bool $use_eta_dest Flag to show Estimatin Time Arrival datetime in form inspection
 * @property bool $use_ata_dest Flag to show Actual Time Arrival datetime in form inspection
 * @property bool $is_publish
 * @property array<array-key, mixed> $required_stages
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ActivityLog> $activitiesAsSubject
 * @property-read int|null $activities_as_subject_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Inspection\InspectionFormItem> $inspection_form_items
 * @property-read int|null $inspection_form_items_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Inspection\InspectionFormSection> $inspection_form_sections
 * @property-read int|null $inspection_form_sections_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionForm newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionForm newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionForm query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionForm whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionForm whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionForm whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionForm whereFlow($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionForm whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionForm whereInspectionType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionForm whereIsPublish($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionForm whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionForm whereRequiredStages($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionForm whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionForm whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionForm whereUseAtaDest($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionForm whereUseEtaDest($value)
 */
	class InspectionForm extends \Eloquent {}
}

namespace App\Models\Inspection{
/**
 * @property int $id
 * @property int $inspection_form_section_id
 * @property string $description
 * @property string $type select (ok/no) / photo
 * @property int $seq
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ActivityLog> $activitiesAsSubject
 * @property-read int|null $activities_as_subject_count
 * @property-read \App\Models\Inspection\InspectionFormSection $inspection_form_section
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormItem query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormItem whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormItem whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormItem whereInspectionFormSectionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormItem whereSeq($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormItem whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormItem whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormItem whereUpdatedBy($value)
 */
	class InspectionFormItem extends \Eloquent {}
}

namespace App\Models\Inspection{
/**
 * @property int $id
 * @property int $inspection_form_id
 * @property string $stage CHECKED_IN/LOADING/CHECKED_OUT
 * @property string $description
 * @property int $seq
 * @property bool $is_separate_page flag print in new page
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ActivityLog> $activitiesAsSubject
 * @property-read int|null $activities_as_subject_count
 * @property-read \App\Models\Inspection\InspectionForm $inspection_form
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Inspection\InspectionFormItem> $inspection_form_items
 * @property-read int|null $inspection_form_items_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormSection newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormSection newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormSection query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormSection whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormSection whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormSection whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormSection whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormSection whereInspectionFormId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormSection whereIsSeparatePage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormSection whereSeq($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormSection whereStage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormSection whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InspectionFormSection whereUpdatedBy($value)
 */
	class InspectionFormSection extends \Eloquent {}
}

namespace App\Models\Inspection{
/**
 * @property int $id
 * @property int $gate_id
 * @property int $inspection_form_id
 * @property string $inspection_no
 * @property \Illuminate\Support\Carbon $inspection_date
 * @property string|null $container_no
 * @property string|null $seal_no
 * @property int $inspected_by
 * @property string $driver_name
 * @property string|null $driver_id_no Driver identity card ex: driver license
 * @property string|null $driver_pic
 * @property string|null $driver_phone_no
 * @property string $vehicle_reg_no Vehicle registration number
 * @property string|null $vehicle_paper_no Vehicle registration number paper
 * @property string|null $vehicle_paper_pic
 * @property int $checked_in_by
 * @property \Illuminate\Support\Carbon $checked_in_at
 * @property int|null $loading_start_by
 * @property \Illuminate\Support\Carbon|null $loading_start_at
 * @property int|null $loading_end_by
 * @property \Illuminate\Support\Carbon|null $loading_end_at
 * @property int|null $checked_out_by
 * @property \Illuminate\Support\Carbon|null $checked_out_at
 * @property \Illuminate\Support\Carbon|null $arrival_time_at_fty Time arrived in factory to loading / unloading
 * @property \Illuminate\Support\Carbon|null $depart_time_from_fty Time depart from factory to export
 * @property \Illuminate\Support\Carbon|null $eta_to_dest Estimation time to destination harbour / airport
 * @property \Illuminate\Support\Carbon|null $ata_to_dest Actual time arrived at destination harbour / airport
 * @property string|null $export_notified_by Notified to Export Departure by
 * @property string|null $remarks
 * @property string $stage CHECKED_IN/LOADING/CHECKED_OUT
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ActivityLog> $activitiesAsSubject
 * @property-read int|null $activities_as_subject_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereArrivalTimeAtFty($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereAtaToDest($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereCheckedInAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereCheckedInBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereCheckedOutAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereCheckedOutBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereContainerNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereDepartTimeFromFty($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereDriverIdNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereDriverName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereDriverPhoneNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereDriverPic($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereEtaToDest($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereExportNotifiedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereGateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereInspectedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereInspectionDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereInspectionFormId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereInspectionNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereLoadingEndAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereLoadingEndBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereLoadingStartAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereLoadingStartBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereRemarks($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereSealNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereStage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereVehiclePaperNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereVehiclePaperPic($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspection whereVehicleRegNo($value)
 */
	class VehicleInspection extends \Eloquent {}
}

namespace App\Models\Inspection{
/**
 * @property int $id
 * @property int $inspection_id
 * @property int $inspection_form_item_id
 * @property string $check { select: ok/no, photo:filename.jpg}
 * @property string|null $remarks
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ActivityLog> $activitiesAsSubject
 * @property-read int|null $activities_as_subject_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspectionItemCheck newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspectionItemCheck newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspectionItemCheck query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspectionItemCheck whereCheck($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspectionItemCheck whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspectionItemCheck whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspectionItemCheck whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspectionItemCheck whereInspectionFormItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspectionItemCheck whereInspectionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspectionItemCheck whereRemarks($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspectionItemCheck whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleInspectionItemCheck whereUpdatedBy($value)
 */
	class VehicleInspectionItemCheck extends \Eloquent {}
}

namespace App\Models\Sanctum{
/**
 * @property string $id
 * @property string $tokenable_type
 * @property string $tokenable_id
 * @property string $name
 * @property string $token
 * @property array<array-key, mixed>|null $abilities
 * @property \Illuminate\Support\Carbon|null $last_used_at
 * @property \Illuminate\Support\Carbon|null $expires_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $tokenable
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonalAccessToken newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonalAccessToken newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonalAccessToken query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonalAccessToken whereAbilities($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonalAccessToken whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonalAccessToken whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonalAccessToken whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonalAccessToken whereLastUsedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonalAccessToken whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonalAccessToken whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonalAccessToken whereTokenableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonalAccessToken whereTokenableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonalAccessToken whereUpdatedAt($value)
 */
	class PersonalAccessToken extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $email
 * @property string $name
 * @property string $password
 * @property string $def_path
 * @property int $site_id
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property \Illuminate\Support\Carbon|null $last_change_password_at
 * @property \Illuminate\Support\Carbon|null $last_login_at
 * @property string|null $remember_token
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ActivityLog> $activitiesAsSubject
 * @property-read int|null $activities_as_subject_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \App\Models\Config\Setup\Site $site
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereDefPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereLastChangePasswordAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereLastLoginAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereSiteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedBy($value)
 */
	class User extends \Eloquent {}
}

