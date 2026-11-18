import DialogContainer, { DialogContainerRef } from '@/components/dialog-container';
import { errorDialog } from '@/components/error-dialog';
import { Spinner } from '@/components/spinner';
import TooltipWrapper from '@/components/tooltip';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputLOV } from '@/components/ui/input-lov';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LovInspectionCategoryColumns } from '@/datatables/columns/lov-inspection-category-columns';
import DataTablePaginationAjax, { DataTablePaginationAjaxRef } from '@/datatables/components/data-table-pagination-ajax';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { generateRandomId } from '@/lib/utils';
import type { InspectionCategoryDT, InspectionFlow, InspectionFlowStage, SharedData } from '@/types';
import { Fieldset } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import _ from 'lodash';
import { CheckIcon, EllipsisVerticalIcon, Loader2, PencilIcon, SaveIcon, X, XIcon } from 'lucide-react';
import { ReactNode, SubmitEvent, useRef, useState } from 'react';
import { toast } from 'sonner';

type InputForm = {
    id: string;
    inspection_category_id: string;
    inspection_category_name: string;
    name: string;
    description?: string;
    stages: Array<InspectionFlowStage>;
};

type EditProps = {
    onFormClosed?: () => void;
    onUpdated?: () => void;
    onError?: (data: any) => void;
    rec?: InspectionFlow;
};

const Edit = ({ onFormClosed, onUpdated, onError, rec }: EditProps): ReactNode => {
    /*** inertia js ***/
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm<Required<InputForm>>({
        id: rec ? rec.id : '',
        inspection_category_id: rec ? rec.inspection_category_id : '',
        inspection_category_name: rec ? rec.inspection_category_name : '',
        name: rec ? rec.name : '',
        description: rec?.description ? rec?.description : '',
        stages: rec ? rec.stages : [],
    });

    /*** state ***/
    const [stageId, setStageId] = useState<string>('');
    const [stageName, setStageName] = useState<string>('');
    const [stageOrder, setStageOrder] = useState<number>(1);

    /*** references ***/
    const lovDialog = useRef<DialogContainerRef>(null);
    const lovCommon = useRef<DataTablePaginationAjaxRef>(null);

    /*** events ***/
    const submitForm = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (data.stages.length <= 0) {
            toast.warning('Warning', { description: `Stage not found.` });
            return;
        }

        put(route('config.inspection.flow.update', { id: data.id }), {
            onSuccess: async (response) => {
                const props = response.props as unknown as SharedData;
                const flash = props.flash;
                if (flash.toast) toast.success(flash.toast.title, { description: flash.toast.message });
                if (onUpdated) onUpdated();
                if (onFormClosed) onFormClosed();
                resetForm();
            },
            onError: async (errors) => {
                if (errors.error) {
                    errorDialog.show({
                        message: errors.error,
                    });
                } else {
                    toast.warning('Warning', { description: refactorErrorMessage(errors) });
                }

                if (onError) onError(errors);
            },
            preserveState: true,
        });
    };

    const resetForm = () => {
        reset(); // clear form to initial values
        clearErrors(); // clear errors
    };

    const handleLOVRowSelected = (data: InspectionCategoryDT): void => {
        setData('inspection_category_id', data.id);
        setData('inspection_category_name', data.name);
        lovDialog.current?.close();
    };

    const handleStageSubmit = () => {
        if (stageName.trim() === '' || stageOrder === 0) {
            toast.warning('Warning', { description: 'Stage name / order invalid.' });
            return;
        }

        // if stageId exist then edit
        if (stageId) {
            // check for duplicate
            const exstingStage = data.stages.find((stage) => stage.order === stageOrder && stage.id !== stageId);
            if (exstingStage) {
                toast.warning('Warning', { description: `Stage order already exist for ${exstingStage.name}.` });
                return;
            }

            setData((prevData) => {
                // get previous stages
                const stages = prevData.stages.filter((item) => item.id !== stageId);

                // push new stage
                stages.push({
                    id: stageId,
                    inspection_flow_id: prevData.inspection_category_id,
                    name: stageName,
                    order: stageOrder,
                });

                return {
                    ...prevData,
                    ...{ stages: _.sortBy(stages, ['order']) },
                };
            });
        } else {
            // check for duplicate
            const exstingStage = data.stages.find((stage) => stage.order === stageOrder);
            if (exstingStage) {
                toast.warning('Warning', { description: 'Stage order already exist.' });
                return;
            }

            setData((prevData) => {
                // get previous stages
                const stages = prevData.stages;

                // push new stage
                stages.push({
                    id: generateRandomId(),
                    inspection_flow_id: prevData.inspection_category_id,
                    name: stageName,
                    order: stageOrder,
                });

                return {
                    ...prevData,
                    ...{ stages: _.sortBy(stages, ['order']) },
                };
            });
        }

        // clear
        setStageId('');
        setStageName('');
        setStageOrder(1);
    };

    const handleStageEdit = (id: string) => {
        const stages = data.stages;
        const stage = stages.find((item) => item.id === id);
        if (!stage) {
            toast.warning('Warning', { description: 'Stage not found.' });
            return;
        }

        // set form
        setStageId(id);
        setStageName(stage.name);
        setStageOrder(stage.order);
    };

    const handleStageRemove = (id: string) => {
        setData((prevData) => {
            return {
                ...prevData,
                ...{ stages: prevData.stages.filter((item) => item.id !== id) },
            };
        });
    };

    return (
        <>
            {!data.id ? (
                <Spinner />
            ) : (
                <form onSubmit={submitForm}>
                    <Fieldset className="gap-4">
                        <FieldGroup className="grid grid-cols-2">
                            <FieldGroup id="inputContainer">
                                <Field className="grid gap-2">
                                    <FieldLabel htmlFor="inspection_category">
                                        Inspection Category <Label className="text-red-500">*</Label>
                                    </FieldLabel>
                                    <InputLOV
                                        className="w-full"
                                        id="inspection_category"
                                        type="text"
                                        valueDisplay={data.inspection_category_name}
                                        placeholder="Inspection Category"
                                        error={errors.inspection_category_id}
                                        onSearchClick={() => lovDialog.current?.open()}
                                    />
                                </Field>
                                <Field className="grid gap-2">
                                    <FieldLabel htmlFor="name">
                                        Name <Label className="text-red-500">*</Label>
                                    </FieldLabel>
                                    <Input
                                        id="name"
                                        type="text"
                                        tabIndex={1}
                                        autoComplete="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Name"
                                        error={errors.name}
                                        maxLength={100}
                                    />
                                </Field>
                                <Field className="grid gap-2">
                                    <FieldLabel htmlFor="description">Description</FieldLabel>
                                    <Input
                                        id="description"
                                        type="text"
                                        tabIndex={2}
                                        autoComplete="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Description"
                                        error={errors.description}
                                        maxLength={255}
                                    />
                                </Field>
                            </FieldGroup>
                            <FieldSet id="stageContainer">
                                <FieldLegend>Stages</FieldLegend>
                                <FieldSeparator className="h-2" />
                                <FieldGroup className="flex-row items-end gap-2">
                                    <Field className="grid gap-2">
                                        <FieldLabel htmlFor="stage_name">
                                            Stage Name <Label className="text-red-500">*</Label>
                                        </FieldLabel>
                                        <Input
                                            id="stage_name"
                                            type="text"
                                            autoComplete="stage_name"
                                            value={stageName}
                                            onChange={(e) => setStageName(e.target.value)}
                                            placeholder="Stage Name"
                                            maxLength={100}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') e.preventDefault();
                                            }}
                                        />
                                    </Field>
                                    <Field className="grid gap-2">
                                        <FieldLabel htmlFor="stage_order">
                                            Order <Label className="text-red-500">*</Label>
                                        </FieldLabel>
                                        <Input
                                            id="stage_order"
                                            type="number"
                                            autoComplete="stage_order"
                                            value={stageOrder}
                                            onChange={(e) => setStageOrder(Number(e.target.value))}
                                            placeholder="Stage Order"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') e.preventDefault();
                                            }}
                                        />
                                    </Field>
                                    <TooltipWrapper caption={`Submit stage`}>
                                        <Button type="button" variant={'normal'} size={'sm'} onClick={handleStageSubmit}>
                                            <SaveIcon />
                                        </Button>
                                    </TooltipWrapper>
                                </FieldGroup>
                                <FieldGroup>
                                    <Table>
                                        <TableHeader className="border-t">
                                            <TableRow>
                                                <TableHead>#</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead className="text-center">Order</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.stages.length <= 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center">
                                                        <Label className="text-muted-foreground">Stage not found</Label>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {data.stages.length > 0 &&
                                                data.stages.map((item, index) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{item.name}</TableCell>
                                                        <TableCell className="text-center">{item.order}</TableCell>
                                                        <TableCell className="text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button type="button" variant="ghost" className="size-8 p-0">
                                                                        <span className="sr-only">Open actions</span>
                                                                        <EllipsisVerticalIcon className="size-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={() => handleStageEdit(item.id)}>
                                                                        <PencilIcon /> Edit
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleStageRemove(item.id)}>
                                                                        <X /> Remove
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>
                        <FieldSeparator className="py-5" />
                        <Field orientation={'horizontal'} className="flex justify-between">
                            <Button type="button" disabled={processing} variant={'default'} onClick={() => onFormClosed && onFormClosed()}>
                                <XIcon className="mr-2 size-4" />
                                Close
                            </Button>
                            <Button type="submit" disabled={processing} variant={'outline'}>
                                {processing ? <Loader2 className="mr-2 size-4 animate-spin" /> : <CheckIcon className="mr-2 size-4" />}
                                Save
                            </Button>
                        </Field>
                    </Fieldset>
                </form>
            )}

            {/* lov - Inspection Category */}
            <DialogContainer title="Inspection Category List" ref={lovDialog} className="md:min-w-3xl">
                <DataTablePaginationAjax
                    pagingType="simple"
                    url={route('dt.config.inspection.category', { is_active: true })}
                    ref={lovCommon}
                    columnDefs={LovInspectionCategoryColumns}
                    containerClass="rounded-sm border"
                    scrollAreaClass="md:h-[425px]"
                    rowId="id"
                    onCancel={() => lovDialog.current?.close()}
                    onRowSelected={handleLOVRowSelected}
                />
            </DialogContainer>
        </>
    );
};

export default Edit;
