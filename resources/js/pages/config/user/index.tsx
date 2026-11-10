import ComboBoxAjax, { ComboBoxAjaxRef } from '@/components/combo-box-ajax';
import { ComboBoxSiteOption, ComboBoxSiteOptionSelected } from '@/components/combo-box-templates/site';
import { confirmDialog } from '@/components/confirm-dialog';
import DialogContainer, { DialogContainerRef } from '@/components/dialog-container';
import { DialogSheetRef } from '@/components/dialog-sheet';
import { errorDialog } from '@/components/error-dialog';
import { loadingDialog } from '@/components/loading-dialog';
import Select from '@/components/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UserColumns } from '@/datatables/columns/user-columns';
import DataTablePaginationAjax, { DataTablePaginationAjaxRef } from '@/datatables/components/data-table-pagination-ajax';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { SiteOption, type BreadcrumbItem, type Menu, type SharedData, type UserDT } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { PlusIcon, XIcon } from 'lucide-react';
import { JSX, useEffect, useRef, useState } from 'react';
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
    const [queryStrings, setQueryStrings] = useState<{ [field: string]: any } | undefined>(undefined);

    /*** references ***/
    const dataTable = useRef<DataTablePaginationAjaxRef>(null);
    const createForm = useRef<DialogContainerRef>(null);
    const editForm = useRef<DialogSheetRef>(null);
    const filterSiteComboAjax = useRef<ComboBoxAjaxRef>(null);

    /*** effect ***/
    useEffect(() => {
        if (queryStrings !== undefined) {
            dataTable.current?.refresh();
        }
    }, [queryStrings]);

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

    const handleFilters = (field: string, value: any) => {
        setQueryStrings({
            ...queryStrings,
            ...{ [field]: value },
        });
    };

    const handleFilterClear = () => {
        setQueryStrings(undefined);
        filterSiteComboAjax.current?.clearOptions();
        dataTable.current?.resetFilters();
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
                <div className="flex items-center justify-between">
                    {/* filters */}
                    <div className="flex space-x-2">
                        <Select
                            className="w-30"
                            placeholder="Active"
                            selectLabel="Filter Active"
                            value={queryStrings ? queryStrings['active'] : ''}
                            onValueChange={(value) => handleFilters('active', value)}
                            items={[
                                { value: 'true', label: 'Yes' },
                                { value: 'false', label: 'No' },
                            ]}
                        />
                        <ComboBoxAjax
                            ref={filterSiteComboAjax}
                            url={route('option.config.setup.site')}
                            additionalQueryStrings={{ is_active: true }}
                            className="me-2 min-w-xs"
                            placeholder="Select site"
                            onValueChange={(data: SiteOption) => handleFilters('site', data.id)}
                            optionComponent={ComboBoxSiteOption}
                            selectedOptionComponent={ComboBoxSiteOptionSelected}
                        />
                        {queryStrings && (
                            <Button aria-label="Reset filters" variant="ghost" className="px-2 lg:px-3" onClick={() => handleFilterClear()}>
                                Reset
                                <XIcon className="size-4" aria-hidden="true" />
                            </Button>
                        )}
                    </div>
                    {access.permissions.create && (
                        <Button type="button" variant={'outline'} onClick={() => createForm.current?.open()}>
                            <PlusIcon />
                            <Label className="hidden md:flex">Create</Label>
                        </Button>
                    )}
                </div>
                <DataTablePaginationAjax
                    url={route('dt.config.user')}
                    additionalQueryStrings={queryStrings}
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
