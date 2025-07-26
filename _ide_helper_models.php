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


namespace App\Models\Config{
/**
 * 
 *
 * @property string $id
 * @property string $site_id
 * @property string $user_id
 * @property string $code
 * @property string $permission read,edit,delete,validation,etc
 * @property bool $is_allowed
 * @property string|null $created_by
 * @property string|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
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
 * 
 *
 * @property string $id
 * @property string $name
 * @property string $site_id
 * @property string $code
 * @property string $permission
 * @property string|null $created_by
 * @property string|null $updated_by
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

namespace App\Models\Config\Inspection{
/**
 * 
 *
 * @property string $id
 * @property string $code
 * @property string $name
 * @property bool $is_visible
 * @property string|null $created_by
 * @property string|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleType query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleType whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleType whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleType whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleType whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleType whereIsVisible($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleType whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleType whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VehicleType whereUpdatedBy($value)
 */
	class VehicleType extends \Eloquent {}
}

namespace App\Models\Config\Setup{
/**
 * 
 *
 * @property string $id
 * @property string $code
 * @property string $name
 * @property string|null $description
 * @property bool $is_active
 * @property string|null $created_by
 * @property string|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
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
 * 
 *
 * @property string $id
 * @property string $site_id
 * @property string $code
 * @property string $name
 * @property bool $is_active
 * @property string|null $created_by
 * @property string|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
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
 * 
 *
 * @property string $id
 * @property string $entity_id
 * @property string $code
 * @property string $name
 * @property string|null $address
 * @property string $timezone
 * @property bool $is_active
 * @property bool $is_default
 * @property string|null $created_by
 * @property string|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site whereIsDefault($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site whereTimezone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Site whereUpdatedBy($value)
 */
	class Site extends \Eloquent {}
}

namespace App\Models\Config\Setup{
/**
 * 
 *
 * @property string $id
 * @property string $site_id
 * @property string $user_id
 * @property bool $is_allowed
 * @property string|null $created_by
 * @property string|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
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
 * 
 *
 * @property string $id
 * @property string $ip
 * @property string|null $os
 * @property string|null $platform
 * @property string|null $browser
 * @property string|null $country
 * @property string|null $city
 * @property string $user_id
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

namespace App\Models{
/**
 * 
 *
 * @property string $id
 * @property string $username
 * @property string $email
 * @property string $name
 * @property string $password
 * @property string $def_path
 * @property string $site_id
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property \Illuminate\Support\Carbon|null $last_change_password_at
 * @property \Illuminate\Support\Carbon|null $last_login_at
 * @property string|null $remember_token
 * @property string|null $created_by
 * @property string|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUsername($value)
 */
	class User extends \Eloquent {}
}

