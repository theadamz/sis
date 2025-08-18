<?php

namespace App\Http\Controllers\Config;

use App\Data\Config\UserCreateData;
use App\Data\Config\UserUpdateData;
use App\Enums\CacheKey;
use App\Enums\PagingType;
use App\Helpers\GeneralHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        // route list
        $routes = GeneralHelper::getRouteList();

        return Inertia::render("config/user/index", [
            'routes' => $routes
        ]);
    }

    public function datatable(): LengthAwarePaginator
    {
        // init the container
        $request = app(Request::class);

        // check if cache exist
        if (Cache::has(CacheKey::USER->getKey())) {
            return Cache::get(CacheKey::USER->getKey());
        }

        // prepare filters
        $perPage = $request->has("per_page") && !empty($request->get('per_page')) && is_numeric($request->get('per_page')) && in_array($request->get('per_page'), config('setting.page.limits')) ? $request->get('per_page') : config('setting.page.default_limit');
        $page = $request->has("page") && !empty($request->get('page')) && is_numeric($request->get('page')) ? $request->get('page') : 1;
        $search = $request->has("search") && str($request->get('search'))->isNotEmpty() ? $request->get('search') : null;

        // handling sort filter
        $sort = ['id', 'asc'];
        if ($request->has("sort") && !empty($request->get('sort'))) {
            $sort = str($request->get('sort'))->explode('.');
            if (!in_array($sort[1], ['asc', 'desc'])) {
                $sort[1] = 'asc';
            }
        }

        // prepare paginate and order by
        $data = User::query()->selectRaw("id, username, email, name, def_path, site_id, is_active, last_login_at")->with(['site:id,name,entity_id', 'site.entity:id,name']);

        // filter with search
        $data->when(!empty(str($search)->trim()), function ($query) use ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('username', 'ilike', "%{$search}%")->orWhere('email', 'ilike', "%{$search}%")->orWhere('name', 'ilike', "%{$search}%");
            });
        });

        $data->when($request->has('is_active') && is_bool(filter_var($request->get('is_active'), FILTER_VALIDATE_BOOLEAN)), function ($query) use ($request) {
            $query->where('is_active', filter_var($request->get('is_active'), FILTER_VALIDATE_BOOLEAN));
        });

        // order by
        $data->orderBy($sort[0], $sort[1]);

        // send link with query string and only send needed data
        $data = $data->paginate($perPage, page: $page)->withQueryString()
            ->through(fn($rec) => [
                'id' => $rec->id,
                'username' => $rec->username,
                'email' => $rec->email,
                'name' => $rec->name,
                'def_path' => $rec->def_path,
                'site_id' => $rec->site_id,
                'site_name' => $rec->site->name,
                'entity_id' => $rec->entity_id,
                'entity_name' => $rec->site->entity->name,
                'is_active' => $rec->is_active,
                'last_login_at' => $rec->last_login_at,
            ]);

        // set cache
        Cache::put(CacheKey::USER->getKey(), $data, config('setting.cacheTime'));

        return $data;
    }

    public function store(UserCreateData $validated): RedirectResponse
    {
        try {
            // check duplicate
            if (User::whereUsername($validated->username)->orWhere('email', $validated->email)->exists()) {
                return back()->withErrors([
                    "username" => "Duplicate data",
                    "email" => "Duplicate data",
                ]);
            }

            // save
            $data = new User($validated->toArray());
            $data->site_id = $validated->site;
            $data->email_verified_at = now();
            $data->save();

            // clear cache
            GeneralHelper::removeCaches(CacheKey::USER->value);

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => 'Success',
                'message' => "Data successfully created.",
            ]);

            return back();
        } catch (\Exception $e) {
            return back()->withErrors([
                "error" => $e->getMessage(),
            ]);
        }
    }

    public function show(User $user, string $id): UserResource
    {
        // validate query parameter
        $validated = Validator::make(['id' => $id], [
            'id' => ['required', "uuid", Rule::exists('users', 'id')],
        ])->validated();

        // get data
        $data = $user->whereId($validated['id'])->selectRaw("username, email, email_verified_at, name, def_path, site_id, is_active")->with('site:id,name')->first();

        return new UserResource($data);
    }

    public function update(UserUpdateData $validated): RedirectResponse
    {
        try {
            // check duplicate
            if (User::where(function (Builder $query) use ($validated) {
                $query->whereUsername($validated->username)->orWhere('email', $validated->email);
            })->where('id', '!=', $validated->id)->exists()) {
                return back()->withErrors([
                    "username" => "Duplicate data",
                    "email" => "Duplicate data",
                ]);
            }

            // if passw
            if (empty($validated->password)) {
                unset($validated->password);
            }

            // save
            $data = User::find($validated->id);
            $data->fill($validated->toArray());
            $data->site_id = $validated->site;

            $data->save();

            // clear cache
            GeneralHelper::removeCaches(CacheKey::USER->value);

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => 'Updated',
                'message' => "Data successfully saved.",
            ]);

            return back();
        } catch (\Exception $e) {
            return back()->withErrors([
                "error" => $e->getMessage(),
            ]);
        }
    }

    public function destroy(Request $request): RedirectResponse
    {
        // validate request
        $validated = Validator::make($request->post(), [
            'ids' => ['required', "array"],
            'ids.*' => ['required', "uuid", Rule::exists('users', 'id')],
        ])->validated();

        try {

            // execute
            User::whereIn('id', $validated['ids'])->delete();

            // clear cache
            GeneralHelper::removeCaches(CacheKey::USER->value);

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => "Success",
                'message' => count($validated['ids']) . " data successfully deleted.",
            ]);

            return back();
        } catch (\Exception $e) {
            return back()->withErrors([
                "error" => $e->getMessage(),
            ]);
        }
    }

    public function options(Request $request): JsonResponse
    {
        // variables
        $pagingType = $request->has('page_type') && !empty(PagingType::tryFrom($request->get('page_type'))) ? PagingType::tryFrom($request->get('page_type')) : PagingType::PAGE; // paging type page|id|no_paging, if $usePaging = true but no PageType then page. default: no_paging
        $perPage = $request->has('per_page') ? filter_var($request->get('per_page'), FILTER_VALIDATE_INT) : config('setting.page.default_limit', 10); // set limit, if not found then become 10
        $page = $pagingType === PagingType::PAGE && $request->has('page') ? filter_var($request->get('page'), FILTER_VALIDATE_INT) : 1; // set page if pageType is offset
        $lastId = $pagingType === PagingType::ID && $request->has('id') ? $request->get('id') : null;

        // check if cache exist
        if (Cache::has(CacheKey::USER->getKey())) {
            return response()->json(['data' => Cache::get(CacheKey::USER->getKey()), 'message' => "OK"], 200);
        }

        // query
        $query = User::select('id', 'username', 'name', 'email', 'site_id')->with('site:id,code,name')
            ->where(function ($query) use ($request) {
                $query->where('username', 'ilike', "%{$request->keyword}%")->orWhere('email', 'ilike', "%{$request->keyword}%")->orWhere('name', 'ilike', "%{$request->keyword}%");
            })->where('is_active', true)->orderBy('id');

        ############################# START PAGING #############################
        // paging offset
        if ($pagingType === PagingType::PAGE) {
            $query->skip($page === 1 ? 0 : (($page - 1) * $perPage));
        }

        // filter paging id
        if ($pagingType === PagingType::ID) {
            if ($lastId === null) {
                $query->whereRaw('id IS NOT NULL');
            } else {
                $query->where('id', '>', $lastId);
            }
        }

        // set limit
        if ($pagingType->hasSize()) {
            $query->limit($perPage);
        }
        ############################# END PAGING #############################

        // get data
        $query = $query->get();

        // set cache
        Cache::put(CacheKey::USER->getKey(), $query, 30); // cache for 30 seconds

        return response()->json(['data' => $query, 'message' => "OK"], 200);
    }
}
