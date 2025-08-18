import { confirmDialog } from '@/components/confirm-dialog';
import DialogSheet, { DialogSheetRef } from '@/components/dialog-sheet';
import { errorDialog } from '@/components/error-dialog';
import { loadingDialog } from '@/components/loading-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EntityColumns } from '@/datatables/columns/entity-columns';
import DataTablePagination, { DataTableRef } from '@/datatables/components/data-table-pagination';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { type BreadcrumbItem, type EntityDT, type SharedData } from '@/types';
import { IDataTablePagination } from '@/types/datatables';
import { Head, router, usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { JSX, useRef, useState } from 'react';
import { toast } from 'sonner';
import Create from './create';
import Edit from './edit';

const breadcrumbsData: BreadcrumbItem[] = [
    {
        title: 'Config',
    },
    {
        title: 'Setup',
    },
    {
        title: 'Entities',
        href: route('config.setup.entity.index'),
    },
];

interface IEntityDataTablePagination extends Omit<IDataTablePagination<EntityDT>, 'data'> {
    data: EntityDT[];
}

interface IndexProps {
    datatable: IEntityDataTablePagination;
}

const Index = ({ datatable }: IndexProps): JSX.Element => {
    /*** inertia js ***/
    const { access } = usePage<SharedData>().props;

    /*** state ***/
    const [id, setId] = useState<string | null>(null);

    /*** references ***/
    const dataTable = useRef<DataTableRef>(null);
    const createForm = useRef<DialogSheetRef>(null);
    const editForm = useRef<DialogSheetRef>(null);

    /*** events ***/
    const handleDelete = async (data: Array<EntityDT>) => {
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
        router.delete(route('config.setup.entity.destroy'), {
            data: { ids: ids },
            onSuccess: (response) => {
                loadingDialog.hide();

                const props = response.props as unknown as SharedData;
                const flash = props.flash;
                if (flash.toast) toast.info(flash.toast.title, { description: flash.toast.message });

                dataTable.current?.clearSelectedRows();
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
            <Head title="Entities" />

            {/* create */}
            {access.permissions.create && (
                <DialogSheet title="Create Entity" ref={createForm} preventInteractionOutside={false}>
                    <Create onFormClosed={() => createForm.current?.close()} />
                </DialogSheet>
            )}

            {/* edit */}
            {access.permissions.edit && (
                <DialogSheet title="Edit Entity" ref={editForm} preventInteractionOutside={false}>
                    <Edit id={id} onUpdated={() => editForm.current?.close()} />
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
                <DataTablePagination
                    ref={dataTable}
                    columnDefs={EntityColumns}
                    data={datatable}
                    containerClass="rounded-sm border"
                    scrollAreaClass="h-[calc(100vh-18rem)]"
                    useShowHideColumn={true}
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
