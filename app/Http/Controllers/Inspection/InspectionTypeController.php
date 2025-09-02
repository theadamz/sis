<?php

namespace App\Http\Controllers\Inspection;

use App\Http\Controllers\Controller;
use App\Http\Requests\Config\Inspection\InspectionTypeRequest;
use App\Models\Inspection\InspectionType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class InspectionTypeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render("config/inspection/type/index");
    }

    public function datatable(): LengthAwarePaginator
    {
        // init the container
        $request = app(Request::class);

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
        $data = InspectionType::query()->selectRaw("id, code, name, is_visible");

        // filter with search
        $data->when(!empty(str($search)->trim()), function ($query) use ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('code', 'ilike', "%{$search}%")->orWhere('name', 'ilike', "%{$search}%");
            });
        });

        $data->when($request->has('is_visible') && is_bool(filter_var($request->get('is_visible'), FILTER_VALIDATE_BOOLEAN)), function ($query) use ($request) {
            $query->where('is_visible', filter_var($request->get('is_visible'), FILTER_VALIDATE_BOOLEAN));
        });

        // order by
        $data->orderBy($sort[0], $sort[1]);

        // send link with query string and only send needed data
        $data = $data->paginate($perPage, page: $page)->withQueryString()
            ->through(fn($rec) => [
                'id' => $rec->id,
                'code' => $rec->code,
                'name' => $rec->name,
                'is_visible' => $rec->is_visible,
            ]);

        return $data;
    }

    public function store(InspectionTypeRequest $request): RedirectResponse
    {
        // validate request
        $validated = $request->validated();

        try {
            // check duplicate
            if (InspectionType::where('code', $validated['code'])->exists()) {
                return back()->withErrors([
                    "code" => "Duplicate data",
                ]);
            }

            // save
            $data = new InspectionType($validated);
            $data->save();

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

    public function show(InspectionType $model, string $id): JsonResponse
    {
        // validate query parameter
        $validated = Validator::make(['id' => $id], [
            'id' => ['required', "uuid",  Rule::exists('inspection_types', 'id')],
        ])->validated();

        // get data
        $data = $model->where('id', $validated['id'])->select(['code', 'name', 'is_visible'])->first();

        return response()->json(['message' => 'Ok', 'data' => $data])->setStatusCode(200);
    }

    public function update(InspectionTypeRequest $request): RedirectResponse
    {
        // validate request
        $validated = $request->validated();

        try {
            // check duplicate
            if (InspectionType::where('code', $validated['code'])->where('id', '!=', $validated['id'])->exists()) {
                return back()->withErrors([
                    "code" => "Duplicate data",
                ]);
            }

            // save
            $data = InspectionType::find($validated['id']);
            $data->fill($validated);
            $data->save();

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
            'ids.*' => ['required', 'string', "uuid", Rule::exists('inspection_types', 'id')],
        ])->validated();

        try {

            // execute
            InspectionType::whereIn('id', $validated['ids'])->lazyById(200, column: 'id')->each->delete();

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
