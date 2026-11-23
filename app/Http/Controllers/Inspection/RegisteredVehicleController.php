<?php

namespace App\Http\Controllers\Inspection;

use App\Data\Inspection\RegisteredVehicleCreateData;
use App\Data\Inspection\RegisteredVehicleUpdateData;
use App\Enums\CacheKey;
use App\Enums\InspectionType;
use App\Enums\VehicleOwnership;
use App\Helpers\GeneralHelper;
use App\Http\Controllers\Controller;
use App\Models\Inspection\InspectionVehicleForm;
use App\Models\Inspection\RegisteredVehicle;
use App\Models\Inspection\VehicleInspection;
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

class RegisteredVehicleController extends Controller
{
    private string $cacheStore = 'file';

    public function index(): InertiaResponse
    {
        $vehicleOwnerships = function () {
            return collect(VehicleOwnership::cases())->map(function ($item) {
                return [
                    'value' => $item->value,
                    'label' => $item->getName()
                ];
            });
        };

        return Inertia::render("inspection/registered-vehicle/index", [
            'vehicleOwnerships' => $vehicleOwnerships(),
            'datatable' => fn() => $this->datatable()
        ]);
    }

    public function datatable(): LengthAwarePaginator
    {
        // init
        $request = app(Request::class);
        $cacheKey = CacheKey::REGISTERED_VEHICLE->getKey();

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
        $data = RegisteredVehicle::query()->selectRaw("id, ownership, reg_no, brand, type, category, model, chassis_no, engine_no, color, registered_for");

        // filter with search
        $data->when(!empty(str($search)->trim()), function ($query) use ($search) {
            $query->where(function ($query) use ($search) {
                $query->orWhere('reg_no', 'ilike', "%{$search}%")->orWhere('reg_no', 'ilike', "%{$search}%");
            });
        });

        // order by
        $data->orderBy($sort[0], $sort[1]);

        // send link with query string and only send needed data
        $data = $data->paginate($perPage, page: $page)->withQueryString()
            ->through(fn($rec) => [
                'id' => $rec->id,
                'ownership' => VehicleOwnership::tryFrom($rec->ownership)->getName(),
                'reg_no' => $rec->reg_no,
                'brand' => $rec->brand,
                'type' => $rec->type,
                'category' => $rec->category,
                'model' => $rec->model,
                'chassis_no' => $rec->chassis_no,
                'engine_no' => $rec->engine_no,
                'color' => $rec->color,
                'registered_for' => $rec->registered_for,
            ]);

        // set cache
        Cache::store($this->cacheStore)->put($cacheKey, $data, now()->addHours(1));

        return $data;
    }

    public function create(): InertiaResponse
    {
        return Inertia::render("inspection/registered-vehicle/index", [
            'rec' => null,
            'action' => 'create'
        ]);
    }

    public function store(RegisteredVehicleCreateData $validated): RedirectResponse
    {
        try {
            // check for duplicate
            $exist = RegisteredVehicle::where('reg_no', $validated->reg_no)->where('site_id', Session::get('site_id'))->exists();
            if ($exist) {
                return back()->withErrors([
                    "message" => ["Registration Number already exist."],
                ]);
            }

            // save
            $data = new RegisteredVehicle($validated->toArray());
            $data->site_id = Session::get('site_id');
            $data->save();

            // clear cache
            GeneralHelper::removeCaches(CacheKey::REGISTERED_VEHICLE->value);

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => 'Success',
                'message' => "Data successfully created.",
            ]);

            return back();
        } catch (\Exception $e) {
            Log::channel('app-track')->error(Response::HTTP_INTERNAL_SERVER_ERROR . ' - ' . Response::$statusTexts[Response::HTTP_INTERNAL_SERVER_ERROR], ['trace' => get_class($this), 'message' => $e->getMessage(), 'uri' => request()->getUri(), 'body' => $validated, 'header' => request()->headers->all(), 'throwable' => $e]);

            return back()->withErrors([
                "error" => $e->getMessage(),
            ]);
        }
    }

    public function edit(string $id): InertiaResponse
    {
        // query
        $data = RegisteredVehicle::query()
            ->selectRaw("id, ownership, reg_no, owner_name, owner_address, paper_no, brand, type, category, model, production_year, power_capacity,
                        chassis_no, engine_no, color, fuel_type, license_plate_color, registration_year, registered_for")
            ->where('id', $id);

        // check if data exist
        if (!$data->exists()) {
            return abort(Response::HTTP_NOT_FOUND);
        }

        // get data
        $data = $data->first();

        return Inertia::render("inspection/registered-vehicle/index", [
            'rec' => $data,
            'action' => 'edit'
        ]);
    }

    public function update(RegisteredVehicleUpdateData $validated): RedirectResponse
    {
        try {
            // check for duplicate
            $exist = RegisteredVehicle::where('reg_no', $validated->reg_no)->where('site_id', Session::get('site_id'))->where('id', '!=', $validated->id)->exists();
            if ($exist) {
                return back()->withErrors([
                    "message" => ["Registration No. already exist."],
                ]);
            }

            // update
            $inspectionFlow = RegisteredVehicle::find($validated->id);
            $inspectionFlow->fill($validated->toArray());
            $inspectionFlow->save();

            // clear cache
            GeneralHelper::removeCaches(CacheKey::REGISTERED_VEHICLE->value);

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => 'Success',
                'message' => "Data successfully saved.",
            ]);

            return back();
        } catch (\Exception $e) {
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
            'ids.*' => ['required', Rule::snowflake(), Rule::exists('registered_vehicles', 'id')->where('site_id', Session::get('site_id'))],
        ])->validated();

        try {

            // execute
            RegisteredVehicle::whereIn('id', $validated['ids'])->where('site_id', Session::get('site_id'))
                ->lazyById(200, column: 'id')->each->delete();

            // clear cache
            GeneralHelper::removeCaches(CacheKey::REGISTERED_VEHICLE->value);

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

    public function duplicate(string $id): InertiaResponse
    {
        $data = RegisteredVehicle::query()
            ->selectRaw("id, ownership, reg_no, owner_name, owner_address, paper_no, brand, type, category, model, production_year, power_capacity,
                        chassis_no, engine_no, color, fuel_type, license_plate_color, registration_year, registered_for")
            ->where('id', $id);

        // check if data exist
        if (!$data->exists()) {
            return abort(Response::HTTP_NOT_FOUND);
        }

        // get data
        $data = $data->first();

        return Inertia::render("inspection/registered-vehicle/index", [
            'rec' => $data,
            'action' => 'duplicate'
        ]);
    }
}
