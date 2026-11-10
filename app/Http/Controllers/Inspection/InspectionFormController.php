<?php

namespace App\Http\Controllers\Inspection;

use App\Data\Inspection\InspectionFormCreateData;
use App\Data\Inspection\InspectionFormUpdateData;
use App\Enums\InspectionStage;
use App\Enums\InspectionType;
use App\Http\Controllers\Controller;
use App\Models\Inspection\InspectionForm;
use App\Models\Inspection\InspectionFormItem;
use App\Models\Inspection\InspectionFormSection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class InspectionFormController extends Controller
{
    private array $inspectionStages;

    public function __construct()
    {
        $this->inspectionStages = collect(InspectionStage::cases())->transform(function ($item) {
            $label = $item->getName();
            $item = (array) $item;

            return [
                ...$item,
                'label' => $label
            ];
        })->all();
    }

    public function index(): Response
    {
        return Inertia::render("basic/inspection-form/vehicle/index")->with([
            'inspectionStages' => $this->inspectionStages
        ]);
    }

    public function datatable(): LengthAwarePaginator
    {
        // init the container
        $request = app(Request::class);

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
        $data = InspectionForm::query()->selectRaw("id, type, code, name, is_publish")->where('type', InspectionType::VEHICLE)
            ->with('inspection_vehicle_forms')
            ->withCount(['inspection_vehicle_form_sections', 'inspection_vehicle_form_items']);

        // filter with search
        $data->when(!empty(str($search)->trim()), function ($query) use ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('code', 'ilike', "%{$search}%")->orWhere('name', 'ilike', "%{$search}%");
            });
        });

        $data->when($request->has('flow'), function ($query) use ($request) {
            $query->where('flow', $request->query('flow'));
        });

        $data->when($request->has('inspection_type'), function ($query) use ($request) {
            $query->where('inspection_type', $request->query('inspection_type'));
        });

        $data->when($request->has('eta_dest') && is_bool(filter_var($request->query('eta_dest'), FILTER_VALIDATE_BOOLEAN)), function ($query) use ($request) {
            $query->where('use_eta_dest', filter_var($request->query('eta_dest'), FILTER_VALIDATE_BOOLEAN));
        });

        $data->when($request->has('ata_dest') && is_bool(filter_var($request->query('ata_dest'), FILTER_VALIDATE_BOOLEAN)), function ($query) use ($request) {
            $query->where('use_ata_dest', filter_var($request->query('ata_dest'), FILTER_VALIDATE_BOOLEAN));
        });

        $data->when($request->has('is_publish') && is_bool(filter_var($request->query('is_publish'), FILTER_VALIDATE_BOOLEAN)), function ($query) use ($request) {
            $query->where('is_publish', filter_var($request->query('is_publish'), FILTER_VALIDATE_BOOLEAN));
        });

        // order by
        $data->orderBy($sort[0], $sort[1]);

        // send link with query string and only send needed data
        $data = $data->paginate($perPage, page: $page)->withQueryString()
            ->through(fn($rec) => [
                'id' => $rec->id,
                'code' => $rec->code,
                'name' => $rec->name,
                'stage' => $rec->inspection_vehicle_forms->stage,
                'use_eta_dest' => $rec->inspection_vehicle_forms->use_eta_dest,
                'use_ata_dest' => $rec->inspection_vehicle_forms->use_ata_dest,
                'is_publish' => $rec->inspection_vehicle_forms->is_publish,
                'inspection_vehicle_form_sections_count' => $rec->inspection_vehicle_form_sections_count,
                'inspection_vehicle_form_items_count' => $rec->inspection_vehicle_form_items_count,
            ]);

        return $data;
    }

    public function create(): Response
    {
        return Inertia::render("basic/inspection-form/vehicle/create")->with([
            'inspectionStages' => $this->inspectionStages
        ]);
    }

    public function store(InspectionFormCreateData $validated)
    {
        // check for duplicate
        $exist = InspectionForm::where(function (Builder $query) use ($validated) {
            $query->where(function (Builder $query) use ($validated) {
                $query->whereRaw("LOWER(code)=?", [str($validated->code)->lower()]);
            });
        })->exists();

        if ($exist) {
            return back()->withErrors([
                "message" => ["Code already exist."],
            ]);
        }

        try {
            // begin trans
            DB::beginTransaction();

            // insert inspection form
            $inspectionForm = InspectionForm::create([
                'flow' => $validated->flow,
                'inspection_type' => $validated->inspection_type,
                'code' => $validated->code,
                'name' => $validated->name,
                'use_eta_dest' => $validated->use_eta_dest,
                'use_ata_dest' => $validated->use_ata_dest,
                'is_publish' => $validated->is_publish,
                'required_stages' => json_encode($validated->required_stages),
            ]);

            // loop inspection
            foreach ($validated->inspections as $section) {
                // insert inspection form section
                $inspectionFormSection = InspectionFormSection::create([
                    'inspection_form_id' => $inspectionForm->id,
                    'stage' => $section['stage'],
                    'description' => $section['description'],
                    'seq' => $section['seq'],
                    'is_separate_page' => $section['is_separate_page'],
                ]);

                // loop section items
                foreach ($section['items'] as $item) {
                    // insert into inspection form items
                    InspectionFormItem::create([
                        'inspection_form_section_id' => $inspectionFormSection->id,
                        'description' => $item['description'],
                        'type' => $item['type'],
                        'seq' => $item['seq'],
                    ]);
                }
            }

            // commit changes
            DB::commit();

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

            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    public function edit(string $id): Response
    {
        // create validator
        $validator = Validator::make(['id' => $id], [
            'id' => ['required', "uuid", Rule::exists('inspection_forms', 'id')],
        ]);

        // check if validator valid
        if (!$validator->valid()) {
            return abort(404);
        }

        $validated = $validator->validated();

        // get data
        $data = InspectionForm::where('id', $validated['id'])
            ->with(['inspection_form_sections', 'inspection_form_sections.inspection_form_items']);

        // check if data exist
        if (!$data->exists()) {
            return abort(404);
        }

        // get data
        $data = $data->first(DB::raw("id, flow, inspection_type, code, name, use_eta_dest, use_ata_dest, is_publish, required_stages"));

        // refactor
        $inspections = collect();
        $sections = collect($data->inspection_form_sections->toArray())->sortBy('seq');

        foreach ($sections as $section) {
            // push to inspections
            $inspections->push([
                'id' => $section['id'],
                'inspection_form_id' => $section['inspection_form_id'],
                'stage' => $section['stage'],
                'description' => $section['description'],
                'seq' => $section['seq'],
                'is_separate_page' => $section['is_separate_page'],
                'items' => collect($section['inspection_form_items'])->transform(function (array $item) {
                    return [
                        'id' => $item['id'],
                        'inspection_form_section_id' => $item['inspection_form_section_id'],
                        'description' => $item['description'],
                        'type' => $item['type'],
                        'seq' => $item['seq'],
                    ];
                })->sortBy('seq')->values()->all(),
            ]);
        }

        // prepare data to send
        $data2edit = [
            'id' => $data->id,
            'flow' => $data->flow,
            'inspection_type' => $data->inspection_type,
            'code' => $data->code,
            'name' => $data->name,
            'use_eta_dest' => $data->use_eta_dest,
            'use_ata_dest' => $data->use_ata_dest,
            'is_publish' => $data->is_publish,
            'required_stages' => json_decode($data->required_stages),
            'inspections' => $inspections->all(),
        ];

        return Inertia::render("inspection/form/edit")->with([
            'inspectionStages' => $this->inspectionStages,
            'data2edit' => $data2edit
        ]);
    }

    public function update(InspectionFormUpdateData $validated)
    {
        // check for duplicate
        $exist = InspectionForm::where(function (Builder $query) use ($validated) {
            $query->where(function (Builder $query) use ($validated) {
                $query->whereRaw("LOWER(code)=?", [str($validated->code)->lower()])->where('id', '!=', $validated->id);
            });
        })->exists();

        if ($exist) {
            return back()->withErrors([
                "message" => ["Code already exist."],
            ]);
        }

        try {
            // begin trans
            DB::beginTransaction();

            // update inspection form
            $inspectionForm = InspectionForm::find($validated->id);
            $inspectionForm->fill([
                'flow' => $validated->flow,
                'inspection_type' => $validated->inspection_type,
                'code' => $validated->code,
                'name' => $validated->name,
                'use_eta_dest' => $validated->use_eta_dest,
                'use_ata_dest' => $validated->use_ata_dest,
                'is_publish' => $validated->is_publish,
                'required_stages' => json_encode($validated->required_stages),
            ]);
            $inspectionForm->save();

            // delete any section that not in the list
            $sectionIds = collect($validated->inspections)->pluck('id')->all();
            InspectionFormSection::where('inspection_form_id', $validated->id)->whereNotIn('id', $sectionIds)->lazyById(200, column: 'id')->each->delete();

            // loop inspection
            foreach ($validated->inspections as $section) {
                // get section
                $inspectionFormSection = InspectionFormSection::where('id', $section['id']);

                // if section exist then update
                if ($inspectionFormSection->exists()) {
                    // get section model
                    $inspectionFormSection = $inspectionFormSection->first();

                    // update data
                    $inspectionFormSection->inspection_form_id = $inspectionForm->id;
                    $inspectionFormSection->stage = $section['stage'];
                    $inspectionFormSection->description = $section['description'];
                    $inspectionFormSection->seq = $section['seq'];
                    $inspectionFormSection->is_separate_page = $section['is_separate_page'];
                    $inspectionFormSection->save();
                } else {
                    // create data
                    $inspectionFormSection = $inspectionFormSection->create([
                        'inspection_form_id' => $inspectionForm->id,
                        'stage' => $section['stage'],
                        'description' => $section['description'],
                        'seq' => $section['seq'],
                        'is_separate_page' => $section['is_separate_page'],
                    ]);
                }

                // delete any section items that not in the list
                $sectionIds = collect($section['items'])->pluck('id')->all();
                InspectionFormItem::where('inspection_form_section_id', $inspectionFormSection->id)->whereNotIn('id', $sectionIds)->lazyById(200, column: 'id')->each->delete();

                // loop section items
                foreach (collect($section['items'])->sortBy('seq')->all() as $item) {
                    // get section
                    $inspectionFormItem = InspectionFormItem::where('id', $item['id']);

                    // if inspection item exist then update
                    if ($inspectionFormItem->exists()) {
                        // get item model
                        $inspectionFormItem = $inspectionFormItem->first();

                        // update data
                        $inspectionFormItem->inspection_form_section_id = $inspectionFormSection->id;
                        $inspectionFormItem->description = $item['description'];
                        $inspectionFormItem->type = $item['type'];
                        $inspectionFormItem->seq = $item['seq'];
                        $inspectionFormItem->save();
                    } else {
                        $inspectionFormItem->create([
                            'inspection_form_section_id' => $inspectionFormSection->id,
                            'description' => $item['description'],
                            'type' => $item['type'],
                            'seq' => $item['seq'],
                        ]);
                    }
                }
            }

            // commit changes
            DB::commit();

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
            'ids.*' => ['required', 'string', "uuid", Rule::exists('inspection_forms', 'id')],
        ])->validated();

        try {

            // execute
            InspectionForm::whereIn('id', $validated['ids'])->lazyById(200, column: 'id')->each->delete();

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
