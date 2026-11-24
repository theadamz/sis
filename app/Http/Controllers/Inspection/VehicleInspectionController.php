<?php

namespace App\Http\Controllers\Inspection;

use App\Enums\CacheKey;
use App\Enums\InspectionType;
use App\Http\Controllers\Controller;
use App\Models\Config\Setup\Gate;
use App\Models\Inspection\InspectionCategory;
use App\Models\Inspection\InspectionDocument;
use App\Models\Inspection\InspectionForm;
use App\Models\Inspection\InspectionVehicleForm;
use App\Models\Inspection\VehicleInspection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class VehicleInspectionController extends Controller
{
    private string $cacheStore = 'file';

    private function getGates()
    {
        $cacheKey = CacheKey::GATE->getKey();
        if (Cache::store($this->cacheStore)->has($cacheKey)) return Cache::store($this->cacheStore)->get($cacheKey);
        $data = Gate::query()->where('is_active', true)->get(['id', 'code', 'name']);
        if (!empty($data)) Cache::store($this->cacheStore)->put($cacheKey, $data->toArray(), now()->addDays(1));
        return $data;
    }

    private function getInspectonCategories()
    {
        $cacheKey = CacheKey::INSPECTION_CATEGORY->getKey();
        if (Cache::store($this->cacheStore)->has($cacheKey)) return Cache::store($this->cacheStore)->get($cacheKey);
        $data = InspectionCategory::query()->where('is_active', true)->get(['id', 'code', 'name', 'is_active']);
        if (!empty($data)) Cache::store($this->cacheStore)->put($cacheKey, $data->toArray(), now()->addDays(1));
        return $data;
    }

    private function getInspectonForms(?string $inspectionCategoryId)
    {
        if (empty($inspectionCategoryId)) return [];

        $cacheKey = CacheKey::INSPECTION_FORM->getKey(InspectionType::VEHICLE->value);
        if (Cache::store($this->cacheStore)->has($cacheKey)) return Cache::store($this->cacheStore)->get($cacheKey);

        // get data
        $data = InspectionForm::query()
            ->where('inspection_type', InspectionType::VEHICLE)
            ->where('is_publish', true)
            ->whereHas('inspection_flow_stage', function (Builder $query) use ($inspectionCategoryId) {
                $query->select(["id", "inspection_flow_id", "name", "order"])->where('order', 1)
                    ->whereHas('inspection_flow', function (Builder $query) use ($inspectionCategoryId) {
                        $query->select(['id', 'inspection_category_id', 'name'])->where('inspection_category_id', $inspectionCategoryId);
                    });
            })
            ->get(['id', 'inspection_flow_stage_id', 'code', 'name', 'is_publish']);

        // refactor
        $data = $data->map(fn($model, $key) => [
            'id' => $model->id,
            'code' => $model->code,
            'name' => $model->name,
            'stage_flow_name' => $model->inspection_flow_stage->name,
            'order' => $model->inspection_flow_stage->order,
        ]);

        if (!empty($data)) Cache::store($this->cacheStore)->put($cacheKey, $data->toArray(), now()->addDays(1));
        return $data;
    }

    public function index(Request $request): InertiaResponse
    {
        return Inertia::render("inspection/vehicle/index", [
            'datatable' => fn() => $this->datatable(),
            'inspectionCategories' => Inertia::defer(fn() => $this->getInspectonCategories())->once(),
            'inspectionForms' => Inertia::optional(fn() => $this->getInspectonForms($request->query('inspection_category')))->once(),
        ]);
    }

    public function datatable(): LengthAwarePaginator
    {
        // init
        $request = app(Request::class);
        $cacheKey = CacheKey::INSPECTION_VEHICLE->getKey();

        // check if cache exist
        if (Cache::store($this->cacheStore)->has($cacheKey)) {
            return Cache::store($this->cacheStore)->get($cacheKey);
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
        $data = InspectionDocument::query()->selectRaw("id, inspection_no, inspection_date, inspection_flow_id, current_inspection_flow_stage_id, status")
            ->with([
                'inspection_flow:id,inspection_category_id,name',
                'inspection_flow.inspection_category:id,name',
                'inspection_flow_stage_current:id,inspection_flow_id,name,order',
            ])
            // ->withCount(['inspection_flow.inspection_flow_stages'])
            ->where('site_id', Session::get('site_id'))->where('inspection_type', InspectionType::VEHICLE);

        // filter with search
        $data->when(!empty(str($search)->trim()), function ($query) use ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('inspection_no', 'ilike', "%{$search}%");
            });
        });

        $data->when($request->has('status'), function ($query) use ($request) {
            $query->where('status', $request->query('status'));
        });


        // order by
        $data->orderBy($sort[0], $sort[1]);

        // send link with query string and only send needed data
        $data = $data->paginate($perPage, page: $page)->withQueryString()
            ->through(fn($rec) => [
                'id' => $rec->id,
                'inspection_no' => $rec->inspection_no,
                'inspection_date' => $rec->inspection_date,
                'status' => $rec->status,
                // 'stage_current' => $rec->inspection_flow_stage_current->name,
                // 'stage_total' => $rec->stage_currnet,
            ]);

        // set cache
        Cache::store($this->cacheStore)->put($cacheKey, $data, now()->addHours(1));

        return $data;
    }

    public function create(Request $request): InertiaResponse
    {
        // check if inspection document is still draft


        return Inertia::render("inspection/vehicle/create");
    }
}
