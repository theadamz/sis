<?php

namespace App\Http\Controllers\Config;

use App\Data\Config\UserAccessCreateData;
use App\Data\Config\UserAccessDuplicateData;
use App\Data\Config\UserAccessUpdateData;
use App\Http\Controllers\Controller;
use App\Models\Config\Access;
use App\Services\AccessService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response as IntertiaResponse;
use Symfony\Component\HttpFoundation\Response;

class AccessController extends Controller
{
    private string $cacheKey;

    public function __construct(
        protected AccessService $service
    ) {
        //
    }

    public function index(): IntertiaResponse
    {
        // get accesses
        $accesses = config('access.lists');

        return Inertia::render("config/access/index", [
            'accesses' => $accesses,
        ]);
    }

    public function retriveUserAccesses(Access $model, string $siteId, string $userId): JsonResponse
    {
        // validate request
        $validated = Validator::make(['site' => $siteId, 'user' => $userId], [
            'site' => ['required', "uuid", Rule::exists("sites", "id")],
            'user' => ['required', "uuid", Rule::exists("users", "id")],
        ])->validated();

        // get access
        $accesses = $model->whereSiteId($validated['site'])->whereUserId($validated['user'])->orderBy('code')->get(['id', 'code', 'permission', 'is_allowed'])->toArray();

        // if access empty
        if (empty($accesses)) {
            return response()->json(['message' => 'Not found', 'data' => []])->setStatusCode(Response::HTTP_NOT_FOUND);
        }

        // variables
        $data = [];
        $code = "";
        $prevAccess = [];
        $permissions = [];

        // loop
        foreach ($accesses as $idx => $access) {
            // if $idx = 0
            if ($idx === 0) {
                $code = $access['code'];
            }

            // if $code is not empty or different with upcoming data then put it in $data
            if (!empty($code) && $code !== $access['code']) {
                // push to $data
                $data[] = [
                    'id' => $access['id'],
                    'code' => $prevAccess['code'],
                    'name' => collect(config('access.lists'))->firstWhere('code', $prevAccess['code'])['name'] ?? null,
                    'permissions' => $permissions
                ];

                // clear $permission and fill $code
                $permissions = [];
                $code = $access['code'];
            }

            // push permission
            $permissions[$access['permission']] = $access['is_allowed'];

            // set code
            $prevAccess = $access;
        }

        // push data terakhir ke $data
        $data[] = [
            'id' => $access['id'],
            'code' => $prevAccess['code'],
            'name' => collect(config('access.lists'))->firstWhere('code', $prevAccess['code'])['name'],
            'permissions' => $permissions
        ];

        return response()->json(['message' => 'Ok', 'data' => $data])->setStatusCode(Response::HTTP_OK);
    }

    public function store(UserAccessCreateData $validated): RedirectResponse
    {
        // variable
        $inserted = 0;

        try {
            // begin trans
            DB::beginTransaction();

            // loop access_lists
            foreach ($validated->access_lists as $accessCode) {
                // get access list by code
                $access = collect(config("access.lists"))->firstWhere('code', $accessCode);

                // if empty then just skip it
                if (empty($access)) continue;

                // check if access already exist for the role
                $isExist = Access::where([
                    ['site_id', '=', $validated->site],
                    ['user_id', '=', $validated->user],
                    ['code', '=', $accessCode],
                    ['permission', '=', $access['permissions'][0]],
                ])->exists();

                // if access already exist then skip it
                if ($isExist) continue;

                // create
                Access::create([
                    'site_id' => $validated->site,
                    'user_id' => $validated->user,
                    'code' => $accessCode,
                    'permission' => $access['permissions'][0],
                    'is_allowed' => true
                ]);

                $inserted++;
            }

            // commit changes
            DB::commit();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_CREATED],
                'message' => $inserted . " access successfully created.",
            ]);

            return back();
        } catch (\Exception $e) {
            // rollback
            DB::rollBack();

            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    public function show(Access $model, string $siteId, string $userId, string $accessCode): JsonResponse
    {
        // validate request
        $validated = Validator::make(['site' => $siteId, 'user' => $userId, 'code' => $accessCode], [
            'site' => ['required', "uuid", Rule::exists("sites", "id")],
            'user' => ['required', "uuid", Rule::exists("users", "id")],
            'code' => ['required', "alpha_dash", Rule::in(collect(config('access.lists'))->pluck("code")->toArray())],
        ])->validated();

        // get access
        $accesses = $model->whereSiteId($validated['site'])->whereUserId($validated['user'])->whereCode($validated['code'])->get(['id', 'code', 'permission', 'is_allowed'])->toArray();

        // if access empty
        if (empty($accesses)) {
            return response()->json(['message' => 'Not found', 'data' => []])->setStatusCode(Response::HTTP_NOT_FOUND);
        }

        // get access data from config
        $accessConfig = collect(config('access.lists'))->firstWhere('code', $accessCode);

        // loop
        $permissions = [];
        $permissionsFromConfig = $accessConfig['permissions']; // get access data permissions values
        foreach ($accesses as $access) {
            // search key by parsing value access permission to permissionsFromConfig
            $key = array_search($access['permission'], $permissionsFromConfig);
            unset($permissionsFromConfig[$key]);

            // add permission and value is_allowed
            $permissions[$access['permission']] = boolval($access['is_allowed']);
        }

        // loop permissionFromConfig to add the rest of things
        foreach ($permissionsFromConfig as $permission) {
            // add permission and value to false
            $permissions[$permission] = false;
        }

        // data to respon
        $data = [
            'code' => $access['code'],
            'name' => $accessConfig['name'],
            'permissions' => $permissions
        ];

        return response()->json(['message' => 'Ok', 'data' => $data])->setStatusCode(Response::HTTP_OK);
    }

    public function update(UserAccessUpdateData $validated): RedirectResponse
    {
        try {
            // begin trans
            DB::beginTransaction();

            // Looping accesses
            foreach ($validated->permissions as $permission => $isAllowed) {
                // check if already exist
                $isExist = Access::where([
                    ['site_id', '=', $validated->site],
                    ['user_id', '=', $validated->user],
                    ['code', '=', $validated->code],
                    ['permission', '=', $permission],
                ])->exists();

                // model
                $model = Access::where([
                    ['site_id', '=', $validated->site],
                    ['user_id', '=', $validated->user],
                    ['code', '=', $validated->code],
                    ['permission', '=', $permission],
                ]);

                if ($isExist) {
                    $model->update([
                        'is_allowed' => $isAllowed
                    ]);
                } else {
                    $model->create([
                        'site_id' => $validated->site,
                        'user_id' => $validated->user,
                        'code' => $validated->code,
                        'permission' => $permission,
                        'is_allowed' => $isAllowed
                    ]);
                }
            }

            // commit changes
            DB::commit();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_OK],
                'message' => "Access successfully saved.",
            ]);

            return back();
        } catch (\Exception $e) {
            // rollback
            DB::rollBack();

            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    public function destroy(Request $request): RedirectResponse
    {
        // validate request
        $validated = Validator::make($request->post(), [
            'site' => ['required', "uuid", Rule::exists('sites', 'id')],
            'user' => ['required', "uuid", Rule::exists('users', 'id')],
            'ids' => ['required', "array"],
            'ids.*' => ['required', "alpha_dash", Rule::in(collect(config('access.lists'))->pluck("code")->toArray())],
        ])->validated();

        try {
            // execute
            Access::whereIn('code', $validated['ids'])
                ->whereSiteId($validated['site'])
                ->whereUserId($validated['user'])
                ->lazyById(200, column: 'id')->each->delete();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_OK],
                'message' => count($validated['ids']) . " access(es) successfully deleted.",
            ]);

            return back();
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    public function duplicate(UserAccessDuplicateData $validated): RedirectResponse
    {
        // check if from_user and to_user is same
        if ($validated->from_user === $validated->to_user) {
            return back()->withErrors([
                "message" => "Please select different user.",
            ]);
        }

        // get access
        $accesses = Access::where("user_id", $validated->from_user);

        // filter exclude sites
        if (!empty($validated->exclude_sites)) {
            $accesses->whereNotIn('site_id', $validated->exclude_sites);
        }

        // filter exclude access code
        if (!empty($validated->exclude_accesses)) {
            $accesses->whereNotIn('code', $validated->exclude_accesses);
        }

        // get access
        $accesses = $accesses->get(['site_id', 'code', 'permission', 'is_allowed']);

        // if accesses empty
        if ($accesses->isEmpty()) {
            return back()->withErrors([
                "message" => "Access from user not found.",
            ]);
        }

        try {
            // begin trans
            DB::beginTransaction();

            // loop
            foreach ($accesses as $row) {
                // check if access already exist
                $access = Access::where([
                    ['site_id', '=', $row->site_id],
                    ['user_id', '=', $validated->to_user],
                    ['code', '=', $row->code],
                    ['permission', '=', $row->permission],
                ]);

                // if already exist then skip
                if ($access->exists()) continue;

                // buat data akses
                $access->create([
                    'site_id' => $row->site_id,
                    'user_id' => $validated->to_user,
                    'code' => $row->code,
                    'permission' => $row->permission,
                    'is_allowed' => $row->is_allowed,
                ]);
            }

            // commit changes
            DB::commit();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_CREATED],
                'message' => "Duplicate success.",
            ]);

            return back();
        } catch (\Exception $e) {
            // rollback
            DB::rollBack();

            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    public function getMenu(): JsonResponse
    {
        // variables
        $menuData = [];
        $data = [
            'groups' => [],
            'menus' => [],
        ];
        $this->cacheKey = "MENU_" . Auth::id();

        // get from cache if production
        if (app()->isProduction()) {
            $menuData = Cache::get($this->cacheKey);
        }

        // if menuData null
        if (empty($menuData)) {
            // delete cache
            Cache::forget($this->cacheKey);

            // get access menu codes
            $menuData = $this->service->getUserAccesses(siteId: Session::get('site_id'), userId: Auth::id());

            // if menuData empty then 404
            if (empty($menuData)) {
                return response()->json(['message' => 'Not found.'])->setStatusCode(Response::HTTP_OK);
            }

            // get menus by parsing menu codes
            $menuData = $this->service->retiveAccessMenuByCodes($menuData);

            // set menus
            $data['menus'] = $menuData;

            // get group
            $menuGroupData = $this->service->retriveMenuGroupsByMenuData($menuData);

            // set menu group
            $data['groups'] = $menuGroupData;

            // set $menuData
            $menuData = $data;

            // save cache
            Cache::forever($this->cacheKey, $menuData);
        }

        return response()->json(['data' => $menuData, 'message' => 'OK'])->setStatusCode(Response::HTTP_OK);
    }
}
