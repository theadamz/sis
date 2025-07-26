import { confirmDialog } from '@/components/confirm-dialog';
import DialogContainer, { DialogContainerRef } from '@/components/dialog-container';
import { errorDialog } from '@/components/error-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LovSiteColumns } from '@/datatables/columns/lov-site-columns';
import DataTablePaginationAjax, { DataTablePaginationAjaxRef } from '@/datatables/components/data-table-pagination-ajax';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { type Entity, type SharedData } from '@/types';
import { useForm } from '@inertiajs/react';
import { CheckIcon, Loader2, XIcon } from 'lucide-react';
import { FormEventHandler, ReactNode, useRef } from 'react';
import { toast } from 'sonner';

type UserForm = {
    username: string;
    email: string;
    name: string;
    password: string;
    def_path: string;
    site: string;
    site_name: string;
    is_active: boolean;
};

interface CreateProps {
    onFormClosed?: () => void;
    onCreated?: () => void;
    onError?: (data: any) => void;
}

const Create = ({ onFormClosed, onCreated, onError }: CreateProps): ReactNode => {
    /*** inertia js ***/
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<Required<UserForm>>({
        username: '',
        email: '',
        name: '',
        password: '',
        def_path: '',
        site: '',
        site_name: '',
        is_active: true,
    });

    /*** references ***/
    const lovDialog = useRef<DialogContainerRef>(null);
    const lovCommon = useRef<DataTablePaginationAjaxRef>(null);

    /*** events ***/
    const submitForm: FormEventHandler = async (e: React.FormEvent<Element>) => {
        e.preventDefault();

        post(route('config.user.store'), {
            onSuccess: async (response) => {
                const props = response.props as unknown as SharedData;
                const flash = props.flash;
                if (flash.toast) toast.success(flash.toast.title, { description: flash.toast.message });
                if (onCreated) onCreated();

                // confirmation create new data
                const confirmation = await confirmDialog.YesNo({ message: 'Create new user?' });
                if (confirmation) {
                    resetForm();
                } else {
                    if (onFormClosed) onFormClosed();
                }
            },
            onError: async (errors) => {
                if (errors.error) {
                    errorDialog.show({
                        message: errors.error,
                    });
                } else {
                    toast.warning('Warning', { description: refactorErrorMessage(errors) });
                }

                if (onError) onError(errors);
            },
        });
    };

    const resetForm = (): void => {
        reset(); // clear form to initial values
        clearErrors(); // clear errors
    };

    const handleLOVRowSelected = (data: Entity): void => {
        setData('site', data.id);
        setData('site_name', data.name);
        lovDialog.current?.close();
    };

    return (
        <>
            <div className="px-2">
                <form onSubmit={submitForm} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username">
                            Username <Label className="text-red-500">*</Label>
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            tabIndex={2}
                            autoComplete="username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            placeholder="Username"
                            error={errors.username}
                            maxLength={255}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">
                            Email <Label className="text-red-500">*</Label>
                        </Label>
                        <Input
                            id="email"
                            type="text"
                            tabIndex={2}
                            autoComplete="email"
                            value={data.username}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Email"
                            error={errors.email}
                            maxLength={255}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">
                            Name <Label className="text-red-500">*</Label>
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            tabIndex={3}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Name"
                            error={errors.name}
                            maxLength={50}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="is_active">Active</Label>
                        <div className="flex">
                            <Checkbox
                                id="is_active"
                                name="is_active"
                                tabIndex={4}
                                defaultChecked={data.is_active}
                                checked={data.is_active}
                                onCheckedChange={(e) => setData('is_active', e.valueOf() as boolean)}
                            />
                            <Label htmlFor="is_active" className="ml-2">
                                Yes
                            </Label>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <div className="flex justify-between">
                            <Button type="button" disabled={processing} variant={'default'} onClick={() => onFormClosed && onFormClosed()}>
                                <XIcon className="mr-2 size-4" />
                                Close
                            </Button>
                            <Button type="submit" disabled={processing} variant={'outline'}>
                                {processing ? <Loader2 className="mr-2 size-4 animate-spin" /> : <CheckIcon className="mr-2 size-4" />}
                                Save
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            {/* lov - site */}
            <DialogContainer title="Site List" ref={lovDialog} className="md:min-w-3xl">
                <DataTablePaginationAjax
                    pagingType="simple"
                    url={route('dt.config.setup.site', { is_active: true })}
                    ref={lovCommon}
                    columnDefs={LovSiteColumns}
                    containerClass="rounded-sm border"
                    scrollAreaClass="md:h-[425px]"
                    rowId="id"
                    onCancel={() => lovDialog.current?.close()}
                    onRowSelected={handleLOVRowSelected}
                />
            </DialogContainer>
        </>
    );
};

export default Create;
