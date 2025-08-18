import { confirmDialog } from '@/components/confirm-dialog';
import DialogContainer, { DialogContainerRef } from '@/components/dialog-container';
import { DialogSheetRef } from '@/components/dialog-sheet';
import { errorDialog } from '@/components/error-dialog';
import { loadingDialog } from '@/components/loading-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UserColumns } from '@/datatables/columns/user-columns';
import DataTablePaginationAjax, { DataTablePaginationAjaxRef } from '@/datatables/components/data-table-pagination-ajax';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { type BreadcrumbItem, type Menu, type SharedData, type UserDT } from '@/types';
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
        title: 'Users',
        href: route('config.user.index'),
    },
];

interface IndexProps {
    routes: Menu[];
}

const Index = ({ routes }: IndexProps): JSX.Element => {
    /*** inertia js ***/
    const { access } = usePage<SharedData>().props;

    /*** state ***/
    const [id, setId] = useState<string | null>(null);

    /*** references ***/
    const dataTable = useRef<DataTablePaginationAjaxRef>(null);
    const createForm = useRef<DialogContainerRef>(null);
    const editForm = useRef<DialogSheetRef>(null);

    /*** events ***/
    const handleDelete = async (data: Array<UserDT>) => {
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
        router.delete(route('config.user.destroy'), {
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
            <Head title="Users" />

            {/* create */}
            {access.permissions.create && (
                <DialogContainer title="Create User" ref={createForm} className="min-w-3xl">
                    <Create routes={routes} onFormClosed={() => createForm.current?.close()} onCreated={() => dataTable.current?.refresh()} />
                </DialogContainer>
            )}

            {/* edit */}
            {access.permissions.edit && (
                <DialogContainer title="Edit User" ref={editForm} className="min-w-3xl">
                    <Edit id={id} routes={routes} onFormClosed={() => editForm.current?.close()} onUpdated={() => dataTable.current?.refresh()} />
                </DialogContainer>
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
                    url={route('dt.config.user')}
                    ref={dataTable}
                    columnDefs={UserColumns}
                    containerClass="rounded-sm border"
                    scrollAreaClass="h-[calc(100vh-18rem)]"
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
