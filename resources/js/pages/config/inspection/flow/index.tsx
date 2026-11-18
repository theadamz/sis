import { confirmDialog } from '@/components/confirm-dialog';
import DialogContainer, { DialogContainerRef } from '@/components/dialog-container';
import { DialogSheetRef } from '@/components/dialog-sheet';
import { errorDialog } from '@/components/error-dialog';
import { loadingDialog } from '@/components/loading-dialog';
import Select from '@/components/select';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InspectionFlowColumns } from '@/datatables/columns/inspection-flow-columns';
import DataTablePaginationAjax, { DataTablePaginationAjaxRef } from '@/datatables/components/data-table-pagination-ajax';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import type { BreadcrumbItem, InspectionCategory, InspectionFlow, InspectionFlowDT, SharedData } from '@/types';
import { Deferred, Head, Link, router, usePage } from '@inertiajs/react';
import { PlusIcon, XIcon } from 'lucide-react';
import { JSX, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Create from './create';
import Duplicate from './duplicate';
import Edit from './edit';

const breadcrumbsData: BreadcrumbItem[] = [
    {
        title: 'Config',
    },
    {
        title: 'Inspections',
    },
    {
        title: 'Flow',
        href: route('config.inspection.flow.index'),
    },
];

interface IndexProps {
    inspectionCategories: Array<InspectionCategory>;
    rec?: InspectionFlow;
    action?: 'create' | 'edit' | 'duplicate';
}

const Index = ({ inspectionCategories, rec, action }: IndexProps): JSX.Element => {
    /*** inertia js ***/
    const { access } = usePage<SharedData>().props;

    /*** state ***/
    const [id, setId] = useState<string | null>(null);
    const [queryStrings, setQueryStrings] = useState<{ [field: string]: any } | undefined>(undefined);

    /*** references ***/
    const dataTable = useRef<DataTablePaginationAjaxRef>(null);
    const createForm = useRef<DialogContainerRef>(null);
    const editForm = useRef<DialogSheetRef>(null);
    const duplicateForm = useRef<DialogSheetRef>(null);

    /*** effect ***/
    useEffect(() => {
        if (queryStrings !== undefined) {
            dataTable.current?.refresh();
        }
    }, [queryStrings]);

    /*** events ***/
    const handleDelete = async (data: Array<InspectionFlowDT>) => {
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
        router.delete(route('config.inspection.flow.destroy'), {
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

    const handleEdit = (data: InspectionFlowDT) => {
        if (!access.permissions.edit) return;
        router.visit(route('config.inspection.flow.edit', { id: data.id }), { only: ['rec', 'action'], preserveUrl: true });
    };

    const handleDupicate = (data: InspectionFlowDT) => {
        if (!access.permissions.create) return;
        router.visit(route('config.inspection.flow.duplicate', { id: data.id }), { only: ['rec', 'action'], preserveUrl: true });
    };

    return (
        <>
            <Head title="Inspection Flow" />

            {/* create */}
            {access.permissions.create && (
                <DialogContainer title="Create Inspection Flow" ref={createForm} className="min-w-5xl" open={action === 'create'}>
                    <Create onFormClosed={() => createForm.current?.close()} onCreated={() => dataTable.current?.refresh()} />
                </DialogContainer>
            )}

            {/* edit */}
            {access.permissions.edit && (
                <DialogContainer title="Edit Inspection Flow" ref={editForm} className="min-w-5xl" open={action === 'edit'}>
                    <Edit rec={rec} onFormClosed={() => editForm.current?.close()} onUpdated={() => dataTable.current?.refresh()} />
                </DialogContainer>
            )}

            {/* duplicate */}
            {access.permissions.create && (
                <DialogContainer title="Duplicate Inspection Flow" ref={duplicateForm} className="min-w-5xl" open={action === 'duplicate'}>
                    <Duplicate rec={rec} onFormClosed={() => duplicateForm.current?.close()} onCreated={() => dataTable.current?.refresh()} />
                </DialogContainer>
            )}

            {/* main content */}
            <section className="mx-auto w-full max-w-7xl p-4">
                <div className="flex items-center justify-between">
                    {/* filters */}
                    <div className="flex space-x-2">
                        <Deferred data={['inspectionCategories']} fallback={<Spinner />}>
                            <Select
                                placeholder="Inspection Category"
                                selectLabel="Filter Inspection Category"
                                value={queryStrings ? queryStrings['category'] : ''}
                                onValueChange={(value) => handleFilters('category', value)}
                                items={
                                    inspectionCategories &&
                                    inspectionCategories.map((item) => {
                                        return { value: item.id, label: item.name };
                                    })
                                }
                            />
                            {queryStrings && (
                                <Button aria-label="Reset filters" variant="ghost" className="px-2 lg:px-3" onClick={() => handleFilterClear()}>
                                    Reset
                                    <XIcon className="size-4" aria-hidden="true" />
                                </Button>
                            )}
                        </Deferred>
                    </div>
                    {access.permissions.create && (
                        <Link href={route('config.inspection.flow.create')} preserveUrl only={['action']}>
                            <Button type="button" variant={'outline'}>
                                <PlusIcon />
                                <Label className="hidden md:flex">Create</Label>
                            </Button>
                        </Link>
                    )}
                </div>
                <DataTablePaginationAjax
                    url={route('dt.config.inspection.flow')}
                    additionalQueryStrings={queryStrings}
                    ref={dataTable}
                    columnDefs={InspectionFlowColumns}
                    containerClass="rounded-sm border"
                    scrollAreaClass="h-[calc(100vh-18rem)]"
                    onEdit={handleEdit}
                    onCustomEvent={(data: InspectionFlowDT, event: string) => {
                        if (event === 'duplicate') handleDupicate(data);
                    }}
                    onDeleteClicked={handleDelete}
                />
            </section>
        </>
    );
};

Index.breadcrumbs = breadcrumbsData;
export default Index;
