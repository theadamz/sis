<?php

namespace App\Http\Controllers\Inspection;

use App\Enums\CacheKey;
use App\Enums\InspectionType;
use App\Http\Controllers\Controller;
use App\Models\Inspection\InspectionVehicleForm;
use App\Models\Inspection\VehicleInspection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class VehicleInspectionController extends Controller
{
    private string $cacheStore = 'file';

    public function index(): InertiaResponse
    {
        return Inertia::render("inspection/vehicle/index", [
            'datatable' => fn() => $this->datatable()
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
        $data = VehicleInspection::query()->selectRaw("id, inspection_no, inspection_date, inspection_form_id, inspected_by, gate_id, container_no, seal_no,
                    vehicle_reg_no, vehicle_reg_no, driver_id_no, driver_name, driver_phone_no, arrival_time_at_fty");

        // filter with search
        $data->when(!empty(str($search)->trim()), function ($query) use ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('container_no', 'ilike', "%{$search}%")->orWhere('seal_no', 'ilike', "%{$search}%");
            });
        });


        // order by
        $data->orderBy($sort[0], $sort[1]);

        // send link with query string and only send needed data
        $data = $data->paginate($perPage, page: $page)->withQueryString()
            ->through(fn($rec) => [
                'id' => $rec->id,
                'container_no' => $rec->container_no,
                'seal_no' => $rec->seal_no,
                'vehicle_reg_no' => $rec->vehicle_reg_no,
            ]);

        // set cache
        Cache::store($this->cacheStore)->put($cacheKey, $data, now()->addHours(1));

        return $data;
    }
}
