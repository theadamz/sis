import { confirmDialog } from '@/components/confirm-dialog';
import DialogContainer, { DialogContainerRef } from '@/components/dialog-container';
import { errorDialog } from '@/components/error-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputLOV } from '@/components/ui/input-lov';
import { Label } from '@/components/ui/label';
import { LovInspectionCategoryColumns } from '@/datatables/columns/lov-inspection-category-columns';
import DataTablePaginationAjax, { DataTablePaginationAjaxRef } from '@/datatables/components/data-table-pagination-ajax';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { InspectionCategoryDT, type SharedData } from '@/types';
import { useForm } from '@inertiajs/react';
import { CheckIcon, Loader2, XIcon } from 'lucide-react';
import { ReactNode, SubmitEvent, useRef } from 'react';
import { toast } from 'sonner';

type InputForm = {
    inspection_category_id: string;
    inspection_category_name: string;
    name: string;
    description?: string;
};

interface CreateProps {
    onFormClosed?: () => void;
    onCreated?: () => void;
    onError?: (data: any) => void;
}

const Create = ({ onFormClosed, onCreated, onError }: CreateProps): ReactNode => {
    /*** inertia js ***/
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<Required<InputForm>>({
        inspection_category_id: '',
        inspection_category_name: '',
        name: '',
        description: '',
    });

    /*** references ***/
    const lovDialog = useRef<DialogContainerRef>(null);
    const lovCommon = useRef<DataTablePaginationAjaxRef>(null);

    /*** events ***/
    const submitForm = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('config.inspection.flow.store'), {
            onSuccess: async (response) => {
                const props = response.props as unknown as SharedData;
                const flash = props.flash;
                if (flash.toast) toast.success(flash.toast.title, { description: flash.toast.message });
                if (onCreated) onCreated();

                // confirmation create new data
                const confirmation = await confirmDialog.YesNo({ message: 'Create new?' });
                if (confirmation) {
                    resetForm();
                } else {
                    if (onFormClosed) onFormClosed();
                }
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
        });
    };

    const resetForm = (): void => {
        reset(); // clear form to initial values
        clearErrors(); // clear errors
        setData({
            inspection_category_id: '',
            inspection_category_name: '',
            name: '',
            description: '',
        });
    };

    const handleLOVRowSelected = (data: InspectionCategoryDT): void => {
        setData('inspection_category_id', data.id);
        setData('inspection_category_name', data.name);
        lovDialog.current?.close();
    };

    return (
        <>
            <div className="px-2">
                <form onSubmit={submitForm} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="inspection_category">
                            Inspection Category <Label className="text-red-500">*</Label>
                        </Label>
                        <InputLOV
                            className="w-full"
                            id="inspection_category"
                            type="text"
                            valueDisplay={data.inspection_category_name}
                            placeholder="Inspection Category"
                            error={errors.inspection_category_id}
                            onSearchClick={() => lovDialog.current?.open()}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">
                            Name <Label className="text-red-500">*</Label>
                        </Label>
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
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
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
                    </div>
                    <div className="mt-5 grid gap-2">
                        <div className="flex justify-between">
                            <Button type="button" disabled={processing} variant={'default'} onClick={() => onFormClosed && onFormClosed()}>
                                <XIcon className="mr-2 size-4" />
                                Close
                            </Button>
                            <Button type="submit" disabled={processing} variant={'outline'}>
                                {processing ? <Loader2 className="mr-2 size-4 animate-spin" /> : <CheckIcon className="mr-2 size-4" />}
                                Save
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

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

export default Create;
