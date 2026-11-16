<?php

namespace App\Http\Controllers\Inspection;

use App\Data\Inspection\InspectionCategoryCreateData;
use App\Data\Inspection\InspectionCategoryupdateData;
use App\Enums\CacheKey;
use App\Helpers\GeneralHelper;
use App\Http\Controllers\Controller;
use App\Models\Inspection\InspectionCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class InspectionCategoryController extends Controller
{
    private string $cacheStore = 'file';

    public function index(): InertiaResponse
    {
        return Inertia::render("config/inspection/category/index");
    }

    public function datatable(): LengthAwarePaginator
    {
        // init the container
        $request = app(Request::class);

        // check if cache exist
        if (Cache::store($this->cacheStore)->has(CacheKey::INSPECTION_CATEGORY->getKey())) {
            return Cache::store($this->cacheStore)->get(CacheKey::INSPECTION_CATEGORY->getKey());
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
        $data = InspectionCategory::query()->selectRaw("id, code, name, is_active")->withCount('inspection_flows as flow_count');

        // filter with search
        $data->when(!empty(str($search)->trim()), function ($query) use ($search) {
            $query->where(function ($query) use ($search) {
                $query->orWhere('code', 'ilike', "%{$search}%")->orWhere('name', 'ilike', "%{$search}%");
            });
        });

        $data->when($request->has('active') && is_bool(filter_var($request->query('active'), FILTER_VALIDATE_BOOLEAN)), function ($query) use ($request) {
            $query->where('is_active', filter_var($request->query('active'), FILTER_VALIDATE_BOOLEAN));
        });

        // order by
        $data->orderBy($sort[0], $sort[1]);

        // send link with query string and only send needed data
        $data = $data->paginate($perPage, page: $page)->withQueryString()
            ->through(fn($rec) => [
                'id' => $rec->id,
                'code' => $rec->code,
                'name' => $rec->name,
                'is_active' => $rec->is_active,
                'flow_count' => $rec->flow_count,
            ]);

        // set cache
        Cache::store($this->cacheStore)->put(CacheKey::INSPECTION_CATEGORY->getKey(), $data, config('setting.cache_time'));

        return $data;
    }

    public function store(InspectionCategoryCreateData $validated): RedirectResponse
    {
        try {
            // check duplicate
            if (InspectionCategory::where('code', $validated->code)->exists()) {
                return back()->withErrors([
                    "code" => "Duplicate data",
                ]);
            }

            // save
            $data = new InspectionCategory($validated->toArray());
            $data->save();

            // clear cache
            GeneralHelper::removeCaches(CacheKey::INSPECTION_CATEGORY->value);

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

    public function show(InspectionCategory $model, string $id): JsonResponse
    {
        // validate query parameter
        $validated = Validator::make(['id' => $id], [
            'id' => ['required', Rule::snowflake(), Rule::exists($model->getTable(), 'id')],
        ])->validated();

        // get data
        $data = $model->whereId($validated['id'])->selectRaw("code, name, is_active")->first();

        // if data empty
        if (empty($data)) {
            throw new HttpResponseException(response([
                "message" => "Data not found.",
            ], Response::HTTP_NOT_FOUND));
        }

        return response()->json(['data' => $data, 'message' => "OK"], Response::HTTP_OK);
    }

    public function update(InspectionCategoryupdateData $validated): RedirectResponse
    {
        try {
            // check duplicate
            if (InspectionCategory::where(function (Builder $query) use ($validated) {
                $query->where('code', $validated->code);
            })->where('id', '!=', $validated->id)->exists()) {
                return back()->withErrors([
                    "code" => "Duplicate data",
                ]);
            }

            // save
            $data = InspectionCategory::find($validated->id);
            $data->fill($validated->toArray());
            $data->save();

            // clear cache
            GeneralHelper::removeCaches(CacheKey::INSPECTION_CATEGORY->value);

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
            'ids.*' => ['required', Rule::snowflake(), Rule::exists('inspection_categories', 'id')],
        ])->validated();

        try {

            // execute
            InspectionCategory::whereIn('id', $validated['ids'])->lazyById(200, column: 'id')->each->delete();

            // clear cache
            GeneralHelper::removeCaches(CacheKey::INSPECTION_CATEGORY->value);

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
