<?php

namespace App\Http\Controllers\Config\Setup;

use App\Enums\CacheKey;
use App\Enums\PagingType;
use App\Helpers\GeneralHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Config\Setup\SiteRequest;
use App\Http\Resources\SiteResource;
use App\Models\Config\Setup\Site;
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

class SiteController extends Controller
{
    public function index(): Response
    {
        return Inertia::render("config/setup/site/index", [
            'datatable' => fn() => $this->datatable(),
            'timezones' => fn() => GeneralHelper::getTimezones(),
        ]);
    }

    public function datatable(): LengthAwarePaginator
    {
        // init the container
        $request = app(Request::class);

        // check if cache exist
        if (Cache::has(CacheKey::SITE->getKey())) {
            return Cache::get(CacheKey::SITE->getKey());
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
        $data = Site::query()->selectRaw("id, entity_id, code, name, address, timezone, is_active")->with(['entity:id,name']);

        // filter with search
        $data->when(!empty(str($search)->trim()), function ($query) use ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('code', 'ilike', "%{$search}%")->orWhere('name', 'ilike', "%{$search}%");
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
                'entity_id' => $rec->entity_id,
                'entity_name' => $rec->entity->name,
                'code' => $rec->code,
                'name' => $rec->name,
                'address' => $rec->address,
                'timezone' => $rec->timezone,
                'is_active' => $rec->is_active,
            ]);

        // set cache
        Cache::put(CacheKey::SITE->getKey(), $data, config('setting.cache_time'));

        return $data;
    }

    public function store(SiteRequest $request): RedirectResponse
    {
        // validate request
        $validated = $request->validated();

        try {
            // check duplicate
            if (Site::where('code', $validated['code'])->where('entity_id', $validated['entity'])->exists()) {
                return back()->withErrors([
                    "code" => "Duplicate data",
                ]);
            }

            // save
            $data = new Site($validated);
            $data->entity_id = $validated['entity'];
            $data->save();

            // clear cache
            GeneralHelper::removeCaches(CacheKey::SITE->value);

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

    public function show(Site $site, string $id): SiteResource
    {
        // validate query parameter
        $validated = Validator::make(['id' => $id], [
            'id' => ['required', "uuid", Rule::exists('sites', 'id')],
        ])->validated();

        // get data
        $data = $site->where('id', $validated['id'])->selectRaw("entity_id, code, name, address, timezone, is_active")->with('entity:id,name')->first();

        return new SiteResource($data);
    }

    public function update(SiteRequest $request): RedirectResponse
    {
        // validate request
        $validated = $request->validated();

        try {
            // check duplicate
            if (Site::where('code', $validated['code'])->where('entity_id', $validated['entity'])->where('id', '!=', $validated['id'])->exists()) {
                return back()->withErrors([
                    "code" => "Duplicate data",
                ]);
            }

            // save
            $data = Site::find($validated['id']);
            $data->fill($validated);
            $data->entity_id = $validated['entity'];
            $data->save();

            // clear cache
            GeneralHelper::removeCaches(CacheKey::SITE->value);

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
            'ids.*' => ['required', "uuid", Rule::exists('sites', 'id')],
        ])->validated();

        try {

            // execute
            Site::whereIn('id', $validated['ids'])->delete();

            // clear cache
            GeneralHelper::removeCaches(CacheKey::SITE->value);

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
        $isActive = $request->has('is_active') ? filter_var($request->get('is_active'), FILTER_VALIDATE_INT) : null;

        // check if cache exist
        if (Cache::has(CacheKey::SITE->getKey())) {
            return response()->json(['data' => Cache::get(CacheKey::SITE->getKey()), 'message' => "OK"], 200);
        }

        // query
        $query = Site::select('id', 'entity_id', 'code', 'name')->with('entity:id,code,name')
            ->where(function ($query) use ($request) {
                $query->where('code', 'ilike', "%{$request->keyword}%")->orWhere('name', 'ilike', "%{$request->keyword}%");
            })->orderBy('id');


        // filter
        if (!empty($isActive)) {
            $query->where('is_active', $isActive);
        }

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
        Cache::put(CacheKey::SITE->getKey(), $query, 30); // cache for 30 seconds

        return response()->json(['data' => $query, 'message' => "OK"], 200);
    }
}
