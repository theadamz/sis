<?php

namespace App\Http\Controllers\Inspection;

use App\Enums\CacheKey;
use App\Http\Controllers\Controller;
use App\Models\Inspection\InspectionCategory;
use App\Models\Inspection\InspectionFlow;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class InspectionFlowController extends Controller
{
    private string $cacheStore = 'file';

    public function index(): InertiaResponse
    {
        $inspectionCategories = function () {
            if (Cache::store($this->cacheStore)->has(CacheKey::INSPECTION_CATEGORY->getKey())) return Cache::get(CacheKey::INSPECTION_CATEGORY->getKey());
            $data = InspectionCategory::query()->where('is_active', true)->get(['id', 'code', 'name']);
            Cache::store($this->cacheStore)->put(CacheKey::INSPECTION_CATEGORY->getKey(), $data, now()->addDays(1)); // cache for 1 day
            return $data;
        };

        return Inertia::render("config/inspection/flow/index", [
            'inspectionCategories' => Inertia::defer($inspectionCategories)
        ]);
    }

    public function datatable(): LengthAwarePaginator
    {
        // init the container
        $request = app(Request::class);

        // check if cache exist
        if (Cache::store($this->cacheStore)->has(CacheKey::INSPECTION_FLOW->getKey())) {
            return Cache::store($this->cacheStore)->get(CacheKey::INSPECTION_FLOW->getKey());
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
        $data = InspectionFlow::query()->selectRaw("id, inspection_category_id, name, description")
            ->with(['inspection_category:id,code,name'])
            ->withCount('inspection_flow_stages as stages_count');

        // filter with search
        $data->when(!empty(str($search)->trim()), function ($query) use ($search) {
            $query->where(function ($query) use ($search) {
                $query->orWhere('name', 'ilike', "%{$search}%")->orWhere('description', 'ilike', "%{$search}%");
            });
        });

        $data->when($request->has('category'), function ($query) use ($request) {
            $query->where('inspection_category_id', $request->query('category'));
        });

        // order by
        $data->orderBy($sort[0], $sort[1]);

        // send link with query string and only send needed data
        $data = $data->paginate($perPage, page: $page)->withQueryString()
            ->through(fn($rec) => [
                'id' => $rec->id,
                'inspection_category_id' => $rec->inspection_category_id,
                'inspection_category_name' => $rec->inspection_category->name,
                'name' => $rec->name,
                'description' => $rec->description,
                'stages_count' => $rec->stages_count,
            ]);

        // set cache
        Cache::store($this->cacheStore)->put(CacheKey::INSPECTION_FLOW->getKey(), $data, config('setting.cache_time'));

        return $data;
    }
}
