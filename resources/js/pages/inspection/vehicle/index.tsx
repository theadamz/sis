import { confirmDialog } from '@/components/confirm-dialog';
import DialogContainer from '@/components/dialog-container';
import { DialogSheetRef } from '@/components/dialog-sheet';
import { errorDialog } from '@/components/error-dialog';
import { loadingDialog } from '@/components/loading-dialog';
import Select from '@/components/select';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { VehicleInspectionColumns } from '@/datatables/columns/vehicle-inspection-columns';
import DataTablePagination from '@/datatables/components/data-table-pagination';
import { DataTablePaginationAjaxRef } from '@/datatables/components/data-table-pagination-ajax';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import type { BreadcrumbItem, InspectionCategory, InspectionFormDT, InspectionFormOption, SharedData, VehicleInspectionDT } from '@/types';
import { IDataTablePagination } from '@/types/datatables';
import { Deferred, Head, router, usePage } from '@inertiajs/react';
import { PlusIcon, XIcon } from 'lucide-react';
import { JSX, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import SelectInspectionForm from './select-inspection-form';

const breadcrumbsData: BreadcrumbItem[] = [
    {
        title: 'Inspection',
    },
    {
        title: 'Vehicle Inspection',
        href: route('inspection.vehicle.index'),
    },
];

interface IEntityDataTablePagination extends Omit<IDataTablePagination<VehicleInspectionDT>, 'data'> {
    data: VehicleInspectionDT[];
}

interface IndexProps {
    datatable: IEntityDataTablePagination;
    inspectionCategories: Array<InspectionCategory>;
    inspectionForms?: Array<InspectionFormOption>;
}

const Index = ({ datatable, inspectionCategories, inspectionForms = [] }: IndexProps): JSX.Element => {
    /*** inertia js ***/
    const { access } = usePage<SharedData>().props;

    /*** state ***/
    const [queryStrings, setQueryStrings] = useState<{ [field: string]: any } | undefined>(undefined);

    /*** references ***/
    const dataTable = useRef<DataTablePaginationAjaxRef>(null);
    const selectInpsectionForm = useRef<DialogSheetRef>(null);
    const editForm = useRef<DialogSheetRef>(null);

    /*** effect ***/
    useEffect(() => {
        if (queryStrings !== undefined) {
            dataTable.current?.refresh();
        }
    }, [queryStrings]);

    /*** events ***/
    const handleFilters = (field: string, value: any) => {
        setQueryStrings({
            ...queryStrings,
            ...{ [field]: value },
        });
    };

    const handleFilterClear = () => {
        setQueryStrings(undefined);
        dataTable.current?.resetFilters();
    };

    const handleDelete = async (data: Array<InspectionFormDT>) => {
        // confirmation
        const confirmation = await confirmDialog.YesNo({
            message: `Are you sure want to delete ${data.length} data?`,
            ConfirmButtonvariant: 'destructive',
        });
        if (!confirmation) return;

        // show progress
        loadingDialog.show();

        // get only id with map
        const ids = data!.map((item) => item.id);

        // delete
        router.delete(route('config.inspection.form.vehicle.destroy'), {
            data: { ids: ids },
            onSuccess: (response) => {
                loadingDialog.hide();

                const props = response.props as unknown as SharedData;
                const flash = props.flash;
                if (flash.toast) toast.info(flash.toast.title, { description: flash.toast.message });

                dataTable.current?.clearSelectedRows();
                dataTable.current?.refresh();
            },
            onError: (errors) => {
                loadingDialog.hide();

                if (errors.error) {
                    errorDialog.show({
                        message: errors.error,
                    });
                } else {
                    toast.warning('Warning', { description: refactorErrorMessage(errors) });
                }
            },
            preserveState: true,
            preserveUrl: true,
        });
    };

    const handleEdit = (data: InspectionFormDT) => {
        router.visit(route('config.inspection.form.vehicle.edit', { id: data.id }));
    };

    const handleCreate = () => {
        selectInpsectionForm.current?.open();
    };

    return (
        <>
            <Head title="Vehicle Inspections" />

            {/* select form */}
            {access.permissions.create && (
                <DialogContainer title="Select Form Inspection" ref={selectInpsectionForm}>
                    <Deferred data={['inspectionCategories']} fallback={<Spinner />}>
                        <SelectInspectionForm
                            inspectionCategories={inspectionCategories}
                            inspectionForms={inspectionForms}
                            onFormClosed={() => selectInpsectionForm.current?.close()}
                        />
                    </Deferred>
                </DialogContainer>
            )}

            {/* main content */}
            <section className="mx-auto w-full p-4">
                <div className="flex items-center justify-between">
                    {/* filters */}
                    <div className="flex space-x-2">
                        <Select
                            className="w-27.5"
                            placeholder="ETA Dest"
                            selectLabel="Filter ETA Dest"
                            value={queryStrings ? queryStrings['eta_dest'] : ''}
                            onValueChange={(value) => handleFilters('eta_dest', value)}
                            items={[
                                { value: 'true', label: 'Yes' },
                                { value: 'false', label: 'No' },
                            ]}
                        />
                        <Select
                            className="w-27.5"
                            placeholder="ATA Dest"
                            selectLabel="Filter ATA Dest"
                            value={queryStrings ? queryStrings['ata_dest'] : ''}
                            onValueChange={(value) => handleFilters('ata_dest', value)}
                            items={[
                                { value: 'true', label: 'Yes' },
                                { value: 'false', label: 'No' },
                            ]}
                        />
                        <Select
                            className="w-27.5"
                            placeholder="Publish"
                            selectLabel="Filter Publish"
                            value={queryStrings ? queryStrings['is_publish'] : ''}
                            onValueChange={(value) => handleFilters('is_publish', value)}
                            items={[
                                { value: 'true', label: 'Yes' },
                                { value: 'false', label: 'No' },
                            ]}
                        />
                        {queryStrings && (
                            <Button aria-label="Reset filters" variant="ghost" className="px-2 lg:px-3" onClick={() => handleFilterClear()}>
                                Reset
                                <XIcon className="size-4" aria-hidden="true" />
                            </Button>
                        )}
                    </div>
                    {/* actions */}
                    {access.permissions.create && (
                        <Button type="button" variant={'outline'} onClick={handleCreate}>
                            <PlusIcon />
                            <Label className="hidden md:flex">Create</Label>
                        </Button>
                    )}
                </div>
                <DataTablePagination
                    ref={dataTable}
                    data={datatable}
                    additionalQueryStrings={queryStrings}
                    columnDefs={VehicleInspectionColumns}
                    containerClass="rounded-sm border"
                    scrollAreaClass="h-[calc(100vh-18rem)]"
                    useShowHideColumn={true}
                    onEdit={(data) => {
                        // setId(data.id);
                        editForm.current?.open();
                    }}
                    onDeleteClicked={handleDelete}
                />
            </section>
        </>
    );
};

Index.breadcrumbs = breadcrumbsData;
export default Index;
