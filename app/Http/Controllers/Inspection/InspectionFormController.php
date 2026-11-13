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
use App\Models\Inspection\InspectionVehicleForm;
use App\Models\Inspection\InspectionVehicleFormItem;
use App\Models\Inspection\InspectionVehicleFormSection;
use CalebDW\Laraflake\Rules\Snowflake;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
            ->with(['inspection_vehicle_form:id,inspection_form_id,use_eta_dest,use_ata_dest,use_duration,stage'])
            ->withCount('inspection_vehicle_form_sections as total_sections')
            ->with(['inspection_vehicle_form' => function ($q) {
                $q->withCount('inspection_vehicle_form_items as total_items');
            }]);

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

        $data->when($request->has('use_duration') && is_bool(filter_var($request->query('use_duration'), FILTER_VALIDATE_BOOLEAN)), function ($query) use ($request) {
            $query->whereHas('inspection_vehicle_form', function (Builder $query) use ($request) {
                $query->where('use_duration', filter_var($request->query('use_duration'), FILTER_VALIDATE_BOOLEAN));
            });
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
                'stage' => $rec->inspection_vehicle_form->stage,
                'use_eta_dest' => $rec->inspection_vehicle_form->use_eta_dest,
                'use_ata_dest' => $rec->inspection_vehicle_form->use_ata_dest,
                'use_duration' => $rec->inspection_vehicle_form->use_duration,
                'is_publish' => $rec->is_publish,
                'total_sections' => $rec->total_sections,
                'total_items' => $rec->inspection_vehicle_form->total_items,
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
                'type' => InspectionType::VEHICLE,
                'code' => $validated->code,
                'name' => $validated->name,
                'is_publish' => $validated->is_publish,
            ]);

            // insert inspection vehicle form
            $inspectionVehicleForm = InspectionVehicleForm::create([
                'inspection_form_id' => $inspectionForm->id,
                'use_eta_dest' => $validated->use_eta_dest,
                'use_ata_dest' => $validated->use_ata_dest,
                'use_duration' => $validated->use_duration,
                'stage' => $validated->stage,
            ]);

            // loop inspection
            foreach ($validated->inspections as $section) {
                // insert inspection vehicle form section
                $inspectionVehicleFormSection = InspectionVehicleFormSection::create([
                    'inspection_vehicle_form_id' => $inspectionVehicleForm->id,
                    'description' => $section['description'],
                    'seq' => $section['seq'],
                    'is_separate_page' => $section['is_separate_page'],
                ]);

                // loop section items
                foreach ($section['items'] as $item) {
                    // insert into inspection vehicle form items
                    InspectionVehicleFormItem::create([
                        'inspection_vehicle_form_section_id' => $inspectionVehicleFormSection->id,
                        'description' => $item['description'],
                        'item_type' => $item['item_type'],
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

            // log error
            Log::channel('app-track')->error('500 - Internal Server Error', ['trace' => get_class($this), 'message' => $e->getMessage(), 'uri' => request()->getUri(), 'body' => $validated, 'header' => request()->headers->all(), 'throwable' => $e]);

            return back()->withErrors([
                "message" => '500 - Internal Server Error',
            ]);
        }
    }

    public function edit(string $id): Response
    {
        // create validator
        $validator = Validator::make(['id' => $id], [
            'id' => ['required', new Snowflake, Rule::exists('inspection_forms', 'id')],
        ]);

        // check if validator valid
        if (!$validator->valid()) {
            return abort(404);
        }

        $validated = $validator->validated();

        // get data
        $data = InspectionForm::query()->selectRaw("id, code, name, is_publish")->where('id', $validated['id'])->where('type', InspectionType::VEHICLE)
            ->with([
                'inspection_vehicle_form:id,inspection_form_id,use_eta_dest,use_ata_dest,use_duration,stage',
                'inspection_vehicle_form_sections:id,inspection_vehicle_form_id,description,seq,is_separate_page',
                'inspection_vehicle_form_sections.inspection_vehicle_form_items:id,inspection_vehicle_form_section_id,description,item_type,seq',
            ]);

        // check if data exist
        if (!$data->exists()) {
            return abort(404);
        }

        // get data
        $data = $data->first();

        // refactor
        $inspections = collect();
        $sections = collect($data->inspection_vehicle_form_sections->toArray())->sortBy('seq');

        foreach ($sections as $section) {
            // push to inspections
            $inspections->push([
                'id' => $section['id'],
                'inspection_vehicle_form_id' => $section['inspection_vehicle_form_id'],
                'description' => $section['description'],
                'seq' => $section['seq'],
                'is_separate_page' => $section['is_separate_page'],
                'items' => collect($section['inspection_vehicle_form_items'])->transform(function (array $item) {
                    return [
                        'id' => $item['id'],
                        'inspection_vehicle_form_section_id' => $item['inspection_vehicle_form_section_id'],
                        'description' => $item['description'],
                        'item_type' => $item['item_type'],
                        'seq' => $item['seq'],
                    ];
                })->sortBy('seq')->values()->all(),
            ]);
        }

        // prepare data to send
        $data2edit = [
            'id' => $data->id,
            'code' => $data->code,
            'name' => $data->name,
            'is_publish' => $data->is_publish,
            'use_eta_dest' => $data->inspection_vehicle_form->use_eta_dest,
            'use_ata_dest' => $data->inspection_vehicle_form->use_ata_dest,
            'use_duration' => $data->inspection_vehicle_form->use_duration,
            'stage' => $data->inspection_vehicle_form->stage,
            'inspections' => $inspections->all(),
        ];

        return Inertia::render("basic/inspection-form/vehicle/edit")->with([
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
                'code' => $validated->code,
                'name' => $validated->name,
                'is_publish' => $validated->is_publish,
            ]);
            $inspectionForm->save();

            // get inspection vehicle form id from relationship
            $inspectionVehicleFormId = $inspectionForm->inspection_vehicle_form->id;

            // update inspection vehicle form
            $inspectionVehicleForm = InspectionVehicleForm::find($inspectionVehicleFormId);
            $inspectionVehicleForm->fill([
                'inspection_form_id' => $inspectionForm->id,
                'use_eta_dest' => $validated->use_eta_dest,
                'use_ata_dest' => $validated->use_ata_dest,
                'use_duration' => $validated->use_duration,
                'stage' => $validated->stage,
            ]);
            $inspectionVehicleForm->save();

            // delete any section that not in the list
            $sectionIds = collect($validated->inspections)->pluck('id')->all();
            InspectionVehicleFormSection::where('inspection_vehicle_form_id', $inspectionVehicleFormId)->whereNotIn('id', $sectionIds)->lazyById(200, column: 'id')->each->delete();

            // loop inspection
            foreach ($validated->inspections as $section) {
                // get section
                $inspectionFormSection = InspectionVehicleFormSection::where('id', $section['id']);

                // if section exist then update
                if ($inspectionFormSection->exists()) {
                    // get section model
                    $inspectionFormSection = $inspectionFormSection->first();

                    // update data
                    $inspectionFormSection->inspection_vehicle_form_id = $inspectionVehicleFormId;
                    $inspectionFormSection->description = $section['description'];
                    $inspectionFormSection->seq = $section['seq'];
                    $inspectionFormSection->is_separate_page = $section['is_separate_page'];
                    $inspectionFormSection->save();
                } else {
                    // create data
                    $inspectionFormSection = $inspectionFormSection->create([
                        'inspection_vehicle_form_id' => $inspectionVehicleFormId,
                        'description' => $section['description'],
                        'seq' => $section['seq'],
                        'is_separate_page' => $section['is_separate_page'],
                    ]);
                }

                // delete any section items that not in the list
                $sectionIds = collect($section['items'])->pluck('id')->all();
                InspectionVehicleFormItem::where('inspection_vehicle_form_section_id', $inspectionFormSection->id)->whereNotIn('id', $sectionIds)->lazyById(200, column: 'id')->each->delete();

                // loop section items
                foreach (collect($section['items'])->sortBy('seq')->all() as $item) {
                    // get section
                    $inspectionFormItem = InspectionVehicleFormItem::where('id', $item['id']);

                    // if inspection item exist then update
                    if ($inspectionFormItem->exists()) {
                        // get item model
                        $inspectionFormItem = $inspectionFormItem->first();

                        // update data
                        $inspectionFormItem->inspection_vehicle_form_section_id = $inspectionFormSection->id;
                        $inspectionFormItem->description = $item['description'];
                        $inspectionFormItem->item_type = $item['item_type'];
                        $inspectionFormItem->seq = $item['seq'];
                        $inspectionFormItem->save();
                    } else {
                        $inspectionFormItem->create([
                            'inspection_vehicle_form_section_id' => $inspectionFormSection->id,
                            'description' => $item['description'],
                            'item_type' => $item['item_type'],
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
            'ids.*' => ['required', 'string', new Snowflake, Rule::exists('inspection_forms', 'id')->where('type', InspectionType::VEHICLE)],
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
            // log error
            Log::channel('app-track')->error('500 - Internal Server Error', ['trace' => get_class($this), 'message' => $e->getMessage(), 'uri' => request()->getUri(), 'body' => $validated, 'header' => request()->headers->all(), 'throwable' => $e]);

            return back()->withErrors([
                "error" => $e->getMessage(),
            ]);
        }
    }
}
