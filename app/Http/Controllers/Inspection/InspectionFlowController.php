<?php

namespace App\Http\Controllers\Inspection;

use App\Data\Inspection\InspectionFlowCreateData;
use App\Data\Inspection\InspectionFlowUpdateData;
use App\Enums\CacheKey;
use App\Helpers\GeneralHelper;
use App\Http\Controllers\Controller;
use App\Models\Inspection\InspectionCategory;
use App\Models\Inspection\InspectionFlow;
use App\Models\Inspection\InspectionFlowStage;
use DB;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class InspectionFlowController extends Controller
{
    private string $cacheStore = 'file';

    private function getInspectionCategories()
    {
        if (Cache::store($this->cacheStore)->has(CacheKey::INSPECTION_CATEGORY->getKey())) return Cache::get(CacheKey::INSPECTION_CATEGORY->getKey());
        $data = InspectionCategory::query()->where('is_active', true)->get(['id', 'code', 'name']);
        Cache::store($this->cacheStore)->put(CacheKey::INSPECTION_CATEGORY->getKey(), $data, now()->addDays(1)); // cache for 1 day
        return $data;
    }

    public function index(): InertiaResponse
    {
        return Inertia::render("config/inspection/flow/index", [
            'inspectionCategories' => Inertia::defer(fn() => $this->getInspectionCategories()),
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

    public function store(InspectionFlowCreateData $validated): RedirectResponse
    {
        try {
            // begin trans
            DB::beginTransaction();

            // save
            $data = new InspectionFlow($validated->toArray());
            $data->save();

            // save for stages
            foreach ($validated->stages as $stage) {
                InspectionFlowStage::create([
                    'inspection_flow_id' => $data->id,
                    'name' => $stage['name'],
                    'order' => $stage['order'],
                ]);
            }

            // commit changes
            DB::commit();

            // clear cache
            GeneralHelper::removeCaches(CacheKey::INSPECTION_FLOW->value);

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => 'Success',
                'message' => "Data successfully created.",
            ]);

            return back();
        } catch (\Exception $e) {
            // rollback
            DB::rollBack();

            Log::channel('app-track')->error(Response::HTTP_INTERNAL_SERVER_ERROR . ' - ' . Response::$statusTexts[Response::HTTP_INTERNAL_SERVER_ERROR], ['trace' => get_class($this), 'message' => $e->getMessage(), 'uri' => request()->getUri(), 'body' => $validated, 'header' => request()->headers->all(), 'throwable' => $e]);

            return back()->withErrors([
                "error" => $e->getMessage(),
            ]);
        }
    }

    public function edit(string $id): InertiaResponse
    {
        // query
        $data = InspectionFlow::query()->selectRaw("id, inspection_category_id, name, description")->where('id', $id)
            ->with([
                'inspection_category:id,code,name',
                'inspection_flow_stages:id,inspection_flow_id,name,order'
            ]);

        // check if data exist
        if (!$data->exists()) {
            return abort(Response::HTTP_NOT_FOUND);
        }

        // get data
        $data = $data->first();

        // prepare data to send
        $rec = [
            'id' => $data->id,
            'inspection_category_id' => $data->inspection_category_id,
            'inspection_category_name' => $data->inspection_category->name,
            'name' => $data->name,
            'description' => $data->description,
            'stages' => collect($data->inspection_flow_stages->toArray())->sortBy('order')->all(),
        ];

        return Inertia::render("config/inspection/flow/index", [
            'inspectionCategories' => Inertia::defer(fn() => $this->getInspectionCategories()),
            'rec' => $rec,
            'action' => 'edit'
        ]);
    }

    public function duplicate(string $id): InertiaResponse
    {
        // query
        $data = InspectionFlow::query()->selectRaw("id, inspection_category_id, name, description")->where('id', $id)
            ->with([
                'inspection_category:id,code,name',
                'inspection_flow_stages:id,inspection_flow_id,name,order'
            ]);

        // check if data exist
        if (!$data->exists()) {
            return abort(Response::HTTP_NOT_FOUND);
        }

        // get data
        $data = $data->first();

        // prepare data to send
        $rec = [
            'id' => $data->id,
            'inspection_category_id' => $data->inspection_category_id,
            'inspection_category_name' => $data->inspection_category->name,
            'name' => $data->name,
            'description' => $data->description,
            'stages' => collect($data->inspection_flow_stages->toArray())->sortBy('order')->all(),
        ];

        return Inertia::render("config/inspection/flow/index", [
            'inspectionCategories' => Inertia::defer(fn() => $this->getInspectionCategories()),
            'rec' => $rec,
            'action' => 'duplicate'
        ]);
    }

    public function update(InspectionFlowUpdateData $validated): RedirectResponse
    {
        try {
            // begin trans
            DB::beginTransaction();

            // update inspection form
            $inspectionFlow = InspectionFlow::find($validated->id);
            $inspectionFlow->fill($validated->toArray());
            $inspectionFlow->save();

            // delete any stage that not in the list
            $stageIds = collect($validated->stages)->pluck('id')->all();
            InspectionFlowStage::where('inspection_flow_id', $inspectionFlow->id)->whereNotIn('id', $stageIds)->lazyById(200, column: 'id')->each->delete();

            // loop stage
            foreach ($validated->stages as $stage) {
                // get stage
                $inspectionFlowStage = InspectionFlowStage::where('id', $stage['id']);

                // if section exist then update
                if ($inspectionFlowStage->exists()) {
                    // get stage model
                    $inspectionFlowStage = $inspectionFlowStage->first();

                    // update data
                    $inspectionFlowStage->name = $stage['name'];
                    $inspectionFlowStage->order = $stage['order'];
                    $inspectionFlowStage->save();
                } else {
                    // create data
                    $inspectionFlowStage = $inspectionFlowStage->create([
                        'inspection_flow_id' => $inspectionFlow->id,
                        'name' => $stage['name'],
                        'order' => $stage['order'],
                    ]);
                }
            }

            // commit changes
            DB::commit();

            // clear cache
            GeneralHelper::removeCaches(CacheKey::INSPECTION_FLOW->value);

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => 'Success',
                'message' => "Data successfully saved.",
            ]);

            return to_route('config.inspection.flow.index');
        } catch (\Exception $e) {
            // rollback
            DB::rollBack();

            // log error
            Log::channel('app-track')->error('500 - Internal Server Error', ['trace' => get_class($this), 'message' => $e->getMessage(), 'uri' => request()->getUri(), 'body' => $validated, 'header' => request()->headers->all(), 'throwable' => $e]);

            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    public function destroy(Request $request): RedirectResponse
    {
        // validate request
        $validated = Validator::make($request->post(), [
            'ids' => ['required', "array"],
            'ids.*' => ['required', Rule::snowflake(), Rule::exists('inspection_flows', 'id')],
        ])->validated();

        try {

            // execute
            InspectionFlow::whereIn('id', $validated['ids'])->lazyById(200, column: 'id')->each->delete();

            // clear cache
            GeneralHelper::removeCaches(CacheKey::INSPECTION_FLOW->value);

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
