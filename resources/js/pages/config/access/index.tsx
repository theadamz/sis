import ComboBoxAjax from '@/components/combo-box-ajax';
import { ComboBoxSiteOption, ComboBoxSiteOptionSelected } from '@/components/combo-box-templates/site';
import { ComboBoxUserInlineOptionSelected, ComboBoxUserOption } from '@/components/combo-box-templates/user';
import { confirmDialog } from '@/components/confirm-dialog';
import DialogContainer, { DialogContainerRef } from '@/components/dialog-container';
import { DialogSheetRef } from '@/components/dialog-sheet';
import { errorDialog } from '@/components/error-dialog';
import { loadingDialog } from '@/components/loading-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AccessColumns } from '@/datatables/columns/access-columns';
import { DataTablePaginationAjaxRef } from '@/datatables/components/data-table-pagination-ajax';
import DataTablePaginationClient from '@/datatables/components/data-table-pagination-client';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { type Access, type BreadcrumbItem, type SharedData, type SiteOption, type UserAccess, type UserOption } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import axios, { HttpStatusCode } from 'axios';
import { CopyIcon, PlusIcon, RefreshCwIcon } from 'lucide-react';
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
        title: 'User Accesses',
        href: route('config.user.index'),
    },
];

interface IndexProps {
    accesses: Access[];
}

const Index = ({ accesses }: IndexProps): JSX.Element => {
    /*** inertia js ***/
    const { access } = usePage<SharedData>().props;

    /*** state ***/
    const [id, setId] = useState<string | null>(null);
    const [data, setData] = useState<Array<UserAccess>>([]);
    const [siteId, setSiteId] = useState<string>();
    const [userId, setUserId] = useState<string>();

    /*** effect ***/
    useEffect(() => {
        if (!siteId || !userId) return;

        handleRetriveAccess();
    }, [siteId, userId]);

    /*** references ***/
    const dataTable = useRef<DataTablePaginationAjaxRef>(null);
    const createForm = useRef<DialogContainerRef>(null);
    const editForm = useRef<DialogSheetRef>(null);
    const duplicateForm = useRef<DialogSheetRef>(null);

    /*** events ***/
    const handleDelete = async (data: Array<UserAccess>) => {
        // confirmation
        const confirmation = await confirmDialog.YesNo({
            message: `Are you sure want to delete ${data.length} data?`,
            ConfirmButtonvariant: 'destructive',
        });

        if (!confirmation) return;

        // show progress
        loadingDialog.show();

        // get only id with map
        const ids = data!.map((item) => item.code);

        // delete
        router.delete(route('config.access.destroy'), {
            data: { ids: ids, site: siteId, user: userId },
            onSuccess: (response) => {
                loadingDialog.hide();

                const props = response.props as unknown as SharedData;
                const flash = props.flash;
                if (flash.toast) toast.info(flash.toast.title, { description: flash.toast.message });

                dataTable.current?.clearSelectedRows();
                handleRetriveAccess();
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

    const handleEdit = async (data: UserAccess) => {
        setId(data.code);
        editForm.current?.open();
    };

    const handleRetriveAccess = async () => {
        if (!siteId || !userId) return;

        const response = await axios.get(route('config.access.get-user-access', { siteId, userId }), { validateStatus: () => true });

        if (![HttpStatusCode.Ok].includes(response.status)) {
            toast.warning('Warning', { description: response.data.message });
            setData([]);
            return;
        }

        setData(response.data.data);
    };

    return (
        <>
            <Head title="User Accesses" />

            {/* create */}
            {access.permissions.create && (
                <DialogContainer title="Create Access" ref={createForm} className="min-w-3xl">
                    <Create accesses={accesses} onFormClosed={() => createForm.current?.close()} onCreated={() => handleRetriveAccess()} />
                </DialogContainer>
            )}

            {/* edit */}
            {access.permissions.edit && (
                <DialogContainer title="Edit Access" ref={editForm} className="min-w-3xl">
                    <Edit
                        id={id}
                        siteId={siteId}
                        userId={userId}
                        onFormClosed={() => editForm.current?.close()}
                        onUpdated={() => handleRetriveAccess()}
                    />
                </DialogContainer>
            )}

            {/* duplicate */}
            {access.permissions.create && (
                <DialogContainer title="Duplicate Access" ref={duplicateForm} className="min-w-3xl">
                    <Duplicate accesses={accesses} onFormClosed={() => duplicateForm.current?.close()} onCreated={() => handleRetriveAccess()} />
                </DialogContainer>
            )}

            {/* main content */}
            <section className="mx-auto w-full max-w-7xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                        <ComboBoxAjax
                            url={route('option.config.setup.site')}
                            additionalQueryStrings={{ is_active: true }}
                            className="me-2 min-w-xs"
                            placeholder="Select site"
                            onValueChange={(data: SiteOption) => {
                                setSiteId(data.id);
                            }}
                            optionComponent={ComboBoxSiteOption}
                            selectedOptionComponent={ComboBoxSiteOptionSelected}
                        />
                        <ComboBoxAjax
                            url={route('option.config.user')}
                            additionalQueryStrings={{ is_active: true }}
                            className="min-w-xs"
                            placeholder="Select user"
                            onValueChange={(data: UserOption) => {
                                setUserId(data.id);
                            }}
                            optionComponent={ComboBoxUserOption}
                            selectedOptionComponent={ComboBoxUserInlineOptionSelected}
                        />
                        <Button type="button" variant={'outline'} onClick={() => handleRetriveAccess()}>
                            <RefreshCwIcon />
                            <Label className="hidden md:flex">Refresh</Label>
                        </Button>
                    </div>
                    {access.permissions.create && (
                        <div className="space-x-2">
                            <Button type="button" variant={'outline'} onClick={() => createForm.current?.open()}>
                                <PlusIcon />
                                <Label className="hidden md:flex">Create</Label>
                            </Button>
                            <Button type="button" variant={'outline'} onClick={() => duplicateForm.current?.open()}>
                                <CopyIcon />
                                <Label className="hidden md:flex">Duplicate</Label>
                            </Button>
                        </div>
                    )}
                </div>
                <div className="flex flex-row">
                    <DataTablePaginationClient
                        ref={dataTable}
                        columnDefs={AccessColumns}
                        data={data}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        containerClass="rounded-sm border"
                        scrollAreaClass="h-[calc(100vh-18rem)]"
                    />
                </div>
            </section>
        </>
    );
};

Index.breadcrumbs = breadcrumbsData;
export default Index;
