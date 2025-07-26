import { confirmDialog } from '@/components/confirm-dialog';
import DialogSheet, { DialogSheetRef } from '@/components/dialog-sheet';
import { errorDialog } from '@/components/error-dialog';
import { loadingDialog } from '@/components/loading-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { VehicleTypeColumns } from '@/datatables/columns/vehicle-type-columns';
import DataTablePaginationAjax from '@/datatables/components/data-table-pagination-ajax';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { type BreadcrumbItem, type Entity, type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { JSX, useRef, useState } from 'react';
import { toast } from 'sonner';
import { DataTablePaginationAjaxRef } from '../../../../datatables/components/data-table-pagination-ajax';
import Create from './create';
import Edit from './edit';

const breadcrumbsData: BreadcrumbItem[] = [
    {
        title: 'Config',
    },
    {
        title: 'Inspection',
    },
    {
        title: 'Vehicle Types',
        href: route('config.inspection.vehicle-type.index'),
    },
];

const Index = (): JSX.Element => {
    /*** inertia js ***/
    const { access } = usePage<SharedData>().props;

    /*** state ***/
    const [id, setId] = useState<string | null>(null);

    /*** references ***/
    const dataTable = useRef<DataTablePaginationAjaxRef>(null);
    const createForm = useRef<DialogSheetRef>(null);
    const editForm = useRef<DialogSheetRef>(null);

    /*** events ***/
    const handleDelete = async (data: Array<Entity>) => {
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
        router.delete(route('config.inspection.vehicle-type.destroy'), {
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

    return (
        <>
            <Head title="Vehicle Types" />

            {/* create */}
            {access.permissions.create && (
                <DialogSheet title="Create Vehicle Types" ref={createForm}>
                    <Create onFormClosed={() => createForm.current?.close()} onCreated={() => dataTable.current?.refresh()} />
                </DialogSheet>
            )}

            {/* edit */}
            {access.permissions.edit && (
                <DialogSheet title="Edit Vehicle Types" ref={editForm}>
                    <Edit id={id} onFormClosed={() => editForm.current?.close()} onUpdated={() => dataTable.current?.refresh()} />
                </DialogSheet>
            )}

            {/* main content */}
            <section className="mx-auto w-full max-w-7xl p-4">
                <div className="flex items-center justify-end">
                    {access.permissions.create && (
                        <Button type="button" variant={'outline'} onClick={() => createForm.current?.open()}>
                            <PlusIcon />
                            <Label className="hidden md:flex">Create</Label>
                        </Button>
                    )}
                </div>
                <DataTablePaginationAjax
                    url={route('dt.config.inspection.vehicle-type')}
                    ref={dataTable}
                    columnDefs={VehicleTypeColumns}
                    containerClass="rounded-sm border"
                    scrollAreaClass="h-[calc(100vh-18rem)]"
                    rowId="id"
                    onEdit={(data) => {
                        setId(data.id);
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
