<?php

namespace App\Http\Controllers\Config;

use App\Enums\CacheKey;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render("config/user/index");
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
}
