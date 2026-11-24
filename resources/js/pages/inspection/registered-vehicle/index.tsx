import { confirmDialog } from '@/components/confirm-dialog';
import DialogContainer, { DialogContainerRef } from '@/components/dialog-container';
import { errorDialog } from '@/components/error-dialog';
import { loadingDialog } from '@/components/loading-dialog';
import Select from '@/components/select';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RegisteredVehicleColumns } from '@/datatables/columns/registered-vehicle-columns';
import DataTablePagination from '@/datatables/components/data-table-pagination';
import { DataTablePaginationAjaxRef } from '@/datatables/components/data-table-pagination-ajax';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import type { BreadcrumbItem, RegisteredVehicle, RegisteredVehicleDT, SharedData } from '@/types';
import { IDataTablePagination } from '@/types/datatables';
import { ActionForm } from '@/types/enum';
import { Deferred, Head, Link, router, usePage } from '@inertiajs/react';
import { PlusIcon, XIcon } from 'lucide-react';
import { JSX, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import FormInput from './form';

const breadcrumbsData: BreadcrumbItem[] = [
    {
        title: 'Inspection',
    },
    {
        title: 'Registered Vehicles',
        href: route('inspection.vehicle.registered-vehicle.index'),
    },
];

interface IRegisteredVehicleDataTablePagination extends Omit<IDataTablePagination<RegisteredVehicleDT>, 'data'> {
    data: RegisteredVehicleDT[];
}

interface IndexProps {
    vehicleOwnerships: Array<{ value: string; label: string }>;
    datatable: IRegisteredVehicleDataTablePagination;
    rec?: RegisteredVehicle;
    action?: ActionForm | null;
}

const Index = ({ vehicleOwnerships, datatable, rec, action = null }: IndexProps): JSX.Element => {
    /*** inertia js ***/
    const { access } = usePage<SharedData>().props;

    /*** state ***/
    const [queryStrings, setQueryStrings] = useState<{ [field: string]: any } | undefined>(undefined);

    /*** references ***/
    const dataTable = useRef<DataTablePaginationAjaxRef>(null);
    const inputForm = useRef<DialogContainerRef>(null);

    /*** effect ***/
    useEffect(() => {
        if (queryStrings !== undefined) {
            dataTable.current?.refresh();
        }
    }, [queryStrings]);

    /*** events ***/
    const handleDelete = async (data: Array<RegisteredVehicleDT>) => {
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
        router.delete(route('inspection.vehicle.registered-vehicle.destroy'), {
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

    const handleEdit = (data: RegisteredVehicleDT) => {
        if (!access.permissions.edit) return;
        router.visit(route('inspection.vehicle.registered-vehicle.edit', { id: data.id }), { only: ['rec', 'action'], preserveUrl: true });
    };

    const handleDupicate = (data: RegisteredVehicleDT) => {
        if (!access.permissions.create) return;
        router.visit(route('inspection.vehicle.registered-vehicle.duplicate', { id: data.id }), { only: ['rec', 'action'], preserveUrl: true });
    };

    return (
        <>
            <Head title="Registered Vehicles" />

            {/* form */}
            {(access.permissions.create || access.permissions.edit) && (
                <DialogContainer
                    title={`${action === ActionForm.edit ? 'Edit Registered Vechile' : action === ActionForm.duplicate ? 'Duplicate Registered Vehicle' : 'Register Vehicle'}`}
                    ref={inputForm}
                    className="min-w-3xl"
                    open={Object.values(ActionForm).includes(action as ActionForm)}
                    showCloseButton={false}
                >
                    <FormInput
                        vehicleOwnerships={vehicleOwnerships}
                        onFormClosed={() => inputForm.current?.close()}
                        onCreated={() => dataTable.current?.refresh()}
                        action={action ?? ActionForm.create}
                        rec={rec}
                    />
                </DialogContainer>
            )}

            {/* main content */}
            <section className="mx-auto w-full p-4">
                <div className="flex items-center justify-between">
                    {/* filters */}
                    <div className="flex space-x-2">
                        <Deferred data={['vehicleOwnerships']} fallback={<Spinner />}>
                            <Select
                                placeholder="Vehicle Ownership"
                                selectLabel="Filter Vehicle Ownership"
                                value={queryStrings ? queryStrings['ownership'] : ''}
                                onValueChange={(value) => handleFilters('ownership', value)}
                                items={vehicleOwnerships}
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
                        <Link href={route('inspection.vehicle.registered-vehicle.create')} preserveUrl only={['action']}>
                            <Button type="button" variant={'outline'}>
                                <PlusIcon />
                                <Label className="hidden md:flex">Create</Label>
                            </Button>
                        </Link>
                    )}
                </div>
                <DataTablePagination
                    ref={dataTable}
                    data={datatable}
                    additionalQueryStrings={queryStrings}
                    columnDefs={RegisteredVehicleColumns}
                    containerClass="rounded-sm border"
                    scrollAreaClass="h-[calc(100vh-18rem)]"
                    useShowHideColumn={true}
                    onEdit={handleEdit}
                    onDeleteClicked={handleDelete}
                    onCustomEvent={(data: RegisteredVehicleDT, event: string) => {
                        if (event === 'duplicate') handleDupicate(data);
                    }}
                />
            </section>
        </>
    );
};

Index.breadcrumbs = breadcrumbsData;
export default Index;
