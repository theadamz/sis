import DialogContainer, { DialogContainerRef } from '@/components/dialog-container';
import { errorDialog } from '@/components/error-dialog';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { InputLOV } from '@/components/ui/input-lov';
import { Label } from '@/components/ui/label';
import { LovSiteColumns } from '@/datatables/columns/lov-site-columns';
import DataTablePaginationAjax, { DataTablePaginationAjaxRef } from '@/datatables/components/data-table-pagination-ajax';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { type GateDT, type SharedData, type SiteDT } from '@/types';
import { useForm } from '@inertiajs/react';
import axios, { HttpStatusCode } from 'axios';
import { CheckIcon, Loader2 } from 'lucide-react';
import { FormEventHandler, ReactNode, useEffect, useRef } from 'react';
import { toast } from 'sonner';

type GateForm = {
    site: string;
    site_name: string;
    code: string;
    name: string;
    is_active: boolean;
};

type EditProps = {
    id: string | null;
    onFormClosed?: () => void;
    onUpdated?: () => void;
    onError?: (data: any) => void;
};

const Edit = ({ id, onFormClosed, onUpdated, onError }: EditProps): ReactNode => {
    /*** inertia js ***/
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm<Required<GateForm>>({
        site: '',
        site_name: '',
        code: '',
        name: '',
        is_active: true,
    });

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
        const response = await axios.get(route('config.setup.gate.show', { id: id }));
        if (![HttpStatusCode.Ok].includes(response.status)) {
            toast.warning('Warning', { description: response.data.message });
            return;
        }

        const data: GateDT = response.data.data;

        setData({
            site: data.site_id,
            site_name: data.site_name,
            code: data.code,
            name: data.name,
            is_active: data.is_active,
        });
    };

    const submitForm: FormEventHandler = (e: React.FormEvent<Element>) => {
        e.preventDefault();

        put(route('config.setup.gate.update', { id: id }), {
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
            <div className="px-4">
                {!data.code ? (
                    <Spinner />
                ) : (
                    <form onSubmit={submitForm} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="code">
                                Site <Label className="text-red-500">*</Label>
                            </Label>
                            <InputLOV
                                className="w-full"
                                id="site"
                                type="text"
                                autoFocus
                                tabIndex={1}
                                valueDisplay={data.site_name}
                                placeholder="Site"
                                error={errors.site}
                                onSearchClick={() => lovDialog.current?.open()}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="code">
                                Code <Label className="text-red-500">*</Label>
                            </Label>
                            <Input
                                id="code"
                                type="text"
                                tabIndex={2}
                                autoComplete="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                placeholder="Code"
                                error={errors.code}
                                maxLength={15}
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
                            <div className="flex justify-end">
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
