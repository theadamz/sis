import { confirmDialog } from '@/components/confirm-dialog';
import { DialogSheetRef } from '@/components/dialog-sheet';
import { errorDialog } from '@/components/error-dialog';
import { loadingDialog } from '@/components/loading-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InspectionFormColumns } from '@/datatables/columns/inspection-form-columns';
import DataTablePaginationAjax, { DataTablePaginationAjaxRef } from '@/datatables/components/data-table-pagination-ajax';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { InspectionFormDT, type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { JSX, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbsData: BreadcrumbItem[] = [
    {
        title: 'Config',
    },
    {
        title: 'Inspection',
    },
    {
        title: 'Form',
        href: route('config.inspection.form.index'),
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
        router.delete(route('config.inspection.type.destroy'), {
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
            <Head title="Inspection Form" />

            {/* main content */}
            <section className="mx-auto w-full max-w-7xl p-4">
                <div className="flex items-center justify-end">
                    {access.permissions.create && (
                        <Button type="button" variant={'outline'} asChild>
                            <Link href={route('config.inspection.form.create')}>
                                <PlusIcon />
                                <Label className="hidden md:flex">Create</Label>
                            </Link>
                        </Button>
                    )}
                </div>
                <DataTablePaginationAjax
                    url={route('dt.config.inspection.form')}
                    ref={dataTable}
                    columnDefs={InspectionFormColumns}
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
