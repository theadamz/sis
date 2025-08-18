import ComboBox from '@/components/combo-box';
import DialogContainer, { DialogContainerRef } from '@/components/dialog-container';
import { errorDialog } from '@/components/error-dialog';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { InputLOV } from '@/components/ui/input-lov';
import { Label } from '@/components/ui/label';
import { LovSiteColumns } from '@/datatables/columns/lov-site-columns';
import DataTablePaginationAjax, { DataTablePaginationAjaxRef } from '@/datatables/components/data-table-pagination-ajax';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { cn } from '@/lib/utils';
import { type Menu, type SharedData, type SiteDT, type UserDT } from '@/types';
import { useForm } from '@inertiajs/react';
import axios, { HttpStatusCode } from 'axios';
import { CheckIcon, EyeClosedIcon, EyeIcon, Loader2, XIcon } from 'lucide-react';
import { FormEventHandler, ReactNode, useEffect, useRef, useState } from 'react';
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

type EditProps = {
    id: string | null;
    routes: Menu[];
    onFormClosed?: () => void;
    onUpdated?: () => void;
    onError?: (data: any) => void;
};

const Edit = ({ id, routes, onFormClosed, onUpdated, onError }: EditProps): ReactNode => {
    /*** inertia js ***/
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm<Required<UserForm>>({
        username: '',
        email: '',
        name: '',
        password: '',
        def_path: '',
        site: '',
        site_name: '',
        is_active: true,
    });

    /*** states ***/
    const [showPassword, setShowPassword] = useState<boolean>(false);

    /*** references ***/
    const lovDialog = useRef<DialogContainerRef>(null);
    const lovCommon = useRef<DataTablePaginationAjaxRef>(null);

    /*** effects ***/
    useEffect(() => {
        if (id === null) return;
        fetchData();
    }, [id]);

    /*** events ***/
    const fetchData = async () => {
        const response = await axios.get(route('config.user.show', { id: id }));
        if (![HttpStatusCode.Ok].includes(response.status)) {
            toast.warning('Warning', { description: response.data.message });
            return;
        }

        const data: UserDT = response.data.data;

        setData({
            username: data.username,
            email: data.email,
            name: data.name,
            password: '',
            def_path: data.def_path,
            site: data.site_id,
            site_name: data.site_name,
            is_active: data.is_active,
        });
    };

    const submitForm: FormEventHandler = (e: React.FormEvent<Element>) => {
        e.preventDefault();

        put(route('config.user.update', { id: id }), {
            onSuccess: async (response) => {
                const props = response.props as unknown as SharedData;
                const flash = props.flash;
                if (flash.toast) toast.success(flash.toast.title, { description: flash.toast.message });
                if (onUpdated) onUpdated();
                if (onFormClosed) onFormClosed();
                resetForm();
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
            preserveState: true,
        });
    };

    const resetForm = () => {
        reset(); // clear form to initial values
        clearErrors(); // clear errors
    };

    const handleLOVRowSelected = (data: SiteDT): void => {
        setData('site', data.id);
        setData('site_name', data.name);
        lovDialog.current?.close();
    };

    return (
        <>
            <div className="px-2">
                {!data.username ? (
                    <Spinner />
                ) : (
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
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Email"
                                error={errors.email}
                                maxLength={255}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">
                                Password <Label className="text-red-500">*</Label>
                            </Label>
                            <div className="flex w-full items-center">
                                <Input
                                    id="password"
                                    className="w-full rounded-e-none border-e-0"
                                    type={showPassword ? 'text' : 'password'}
                                    tabIndex={2}
                                    autoComplete="Password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                    maxLength={255}
                                    error={errors.password}
                                    showErrorMessage={false}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className={cn('rounded-s-none', errors.password ? 'border-red-500' : '')}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
                                </Button>
                            </div>
                            {errors.password && <InputError message={errors.password} />}
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
                            <Label htmlFor="def_path">
                                Default Path <Label className="text-red-500">*</Label>
                            </Label>
                            <ComboBox
                                className="min-w-full"
                                placeholder="Select"
                                defValue={data.def_path}
                                items={routes.map((item) => {
                                    return { value: item.path, label: `${item.name} (${item.path})` };
                                })}
                                onValueChange={(value) => setData('def_path', value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="site">
                                Site <Label className="text-red-500">*</Label>
                            </Label>
                            <InputLOV
                                className="w-full"
                                id="site"
                                type="text"
                                valueDisplay={data.site_name}
                                placeholder="Site"
                                error={errors.site}
                                onSearchClick={() => lovDialog.current?.open()}
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
                        <div className="mt-5 grid gap-2">
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
                )}
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

export default Edit;
