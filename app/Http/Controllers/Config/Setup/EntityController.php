<?php

namespace App\Http\Controllers\Config\Setup;

use App\Enums\CacheKey;
use App\Helpers\GeneralHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Config\Setup\EntityRequest;
use App\Models\Config\Setup\Entity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class EntityController extends Controller
{
    public function index(): Response
    {
        return Inertia::render("config/setup/entity/index", [
            'datatable' => fn() => $this->datatable()
        ]);
    }

    public function datatable(): LengthAwarePaginator
    {
        // init the container
        $request = app(Request::class);

        // check if cache exist
        if (Cache::has(CacheKey::ENTITY->getKey())) {
            return Cache::get(CacheKey::ENTITY->getKey());
        }

        // prepare filters
        $perPage = $request->has("per_page") && !empty($request->query('per_page')) && is_numeric($request->query('per_page')) && in_array($request->query('per_page'), config('setting.page.limits')) ? $request->query('per_page') : config('setting.page.default_limit');
        $page = $request->has("page") && !empty($request->query('page')) && is_numeric($request->query('page')) ? $request->query('page') : 1;
        $search = $request->has("search") && str($request->query('search'))->isNotEmpty() ? $request->query('search') : null;

        // handling sort filter
        $sort = ['id', 'asc'];
        if ($request->has("sort") && !empty($request->query('sort'))) {
            $sort = str($request->query('sort'))->explode('.');
            if (!in_array($sort[1], ['asc', 'desc'])) {
                $sort[1] = 'asc';
            }
        }

        // prepare paginate and order by
        $data = Entity::query()->selectRaw("id, code, name, description, is_active");

        // filter with search
        $data->when(!empty(str($search)->trim()), function ($query) use ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('code', 'ilike', "%{$search}%")->orWhere('name', 'ilike', "%{$search}%");
            });
        });

        $data->when($request->has('is_active') && is_bool(filter_var($request->query('is_active'), FILTER_VALIDATE_BOOLEAN)), function ($query) use ($request) {
            $query->where('is_active', filter_var($request->query('is_active'), FILTER_VALIDATE_BOOLEAN));
        });

        // order by
        $data->orderBy($sort[0], $sort[1]);

        // send link with query string and only send needed data
        $data = $data->paginate($perPage, page: $page)->withQueryString()
            ->through(fn($rec) => [
                'id' => $rec->id,
                'code' => $rec->code,
                'name' => $rec->name,
                'description' => $rec->description,
                'is_active' => $rec->is_active,
            ]);

        // set cache
        Cache::put(CacheKey::ENTITY->getKey(), $data, config('setting.cache_time'));

        return $data;
    }

    public function store(EntityRequest $request): RedirectResponse
    {
        // validate request
        $validated = $request->validated();

        try {
            // check duplicate
            if (Entity::where('code', $validated['code'])->exists()) {
                return back()->withErrors([
                    "code" => "Duplicate data",
                ]);
            }

            // save
            $data = new Entity($validated);
            $data->save();

            // clear cache
            GeneralHelper::removeCaches(CacheKey::ENTITY->value);

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

    public function show(Entity $entity, string $id): JsonResponse
    {
        // validate query parameter
        $validated = Validator::make(['id' => $id], [
            'id' => ['required', Rule::snowflake(),  Rule::exists('entities', 'id')],
        ])->validated();

        // get data
        $data = $entity->where('id', $validated['id'])->select(['code', 'name', 'description', 'is_active'])->first();

        return response()->json(['message' => 'Ok', 'data' => $data])->setStatusCode(200);
    }

    public function update(EntityRequest $request): RedirectResponse
    {
        // validate request
        $validated = $request->validated();

        try {
            // check duplicate
            if (Entity::where('code', $validated['code'])->where('id', '!=', $validated['id'])->exists()) {
                return back()->withErrors([
                    "code" => "Duplicate data",
                ]);
            }

            // save
            $data = Entity::find($validated['id']);
            $data->fill($validated);
            $data->save();

            // clear cache
            GeneralHelper::removeCaches(CacheKey::ENTITY->value);

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
            'ids.*' => ['required', Rule::snowflake(), Rule::exists('entities', 'id')],
        ])->validated();

        try {

            // execute
            Entity::whereIn('id', $validated['ids'])->lazyById(200, column: 'id')->each->delete();

            // clear cache
            GeneralHelper::removeCaches(CacheKey::ENTITY->value);

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
}
