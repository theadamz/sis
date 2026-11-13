import { confirmDialog } from '@/components/confirm-dialog';
import { DialogSheetRef } from '@/components/dialog-sheet';
import { errorDialog } from '@/components/error-dialog';
import { loadingDialog } from '@/components/loading-dialog';
import Select from '@/components/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InspectionFormColumns } from '@/datatables/columns/inspection-form-columns';
import DataTablePaginationAjax, { DataTablePaginationAjaxRef } from '@/datatables/components/data-table-pagination-ajax';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { type BreadcrumbItem, type InspectionFormDT, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlusIcon, XIcon } from 'lucide-react';
import { JSX, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbsData: BreadcrumbItem[] = [
    {
        title: 'Config',
    },
    {
        title: 'Inspection Forms',
    },
    {
        title: 'Vehicle',
        href: route('basic.inspection-form.vehicle.index'),
    },
];

interface IndexProps {}

const Index = ({}: IndexProps): JSX.Element => {
    /*** inertia js ***/
    const { access } = usePage<SharedData>().props;

    /*** state ***/
    const [queryStrings, setQueryStrings] = useState<{ [field: string]: any } | undefined>(undefined);

    /*** references ***/
    const dataTable = useRef<DataTablePaginationAjaxRef>(null);
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
        router.delete(route('basic.inspection-form.vehicle.destroy'), {
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
        router.visit(route('basic.inspection-form.vehicle.edit', { id: data.id }));
    };

    return (
        <>
            <Head title="Inspection Form" />

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
                            placeholder="Duration"
                            selectLabel="Filter Duration"
                            value={queryStrings ? queryStrings['use_duration'] : ''}
                            onValueChange={(value) => handleFilters('use_duration', value)}
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
                        <Button type="button" variant={'outline'} asChild>
                            <Link href={route('basic.inspection-form.vehicle.create')}>
                                <PlusIcon />
                                <Label className="hidden md:flex">Create</Label>
                            </Link>
                        </Button>
                    )}
                </div>
                <DataTablePaginationAjax
                    url={route('dt.basic.inspection-form.vehicle')}
                    additionalQueryStrings={queryStrings}
                    ref={dataTable}
                    columnDefs={InspectionFormColumns}
                    containerClass="rounded-sm border"
                    scrollAreaClass="h-[calc(100vh-19rem)]"
                    rowId="id"
                    onEdit={handleEdit}
                    onDeleteClicked={handleDelete}
                />
            </section>
        </>
    );
};

Index.breadcrumbs = breadcrumbsData;
export default Index;
