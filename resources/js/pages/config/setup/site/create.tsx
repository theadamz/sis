import ComboBox from '@/components/combo-box';
import { confirmDialog } from '@/components/confirm-dialog';
import DialogContainer, { DialogContainerRef } from '@/components/dialog-container';
import { errorDialog } from '@/components/error-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { InputLOV } from '@/components/ui/input-lov';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LovEntityColumns } from '@/datatables/columns/lov-entity-columns';
import DataTablePaginationAjax, { DataTablePaginationAjaxRef } from '@/datatables/components/data-table-pagination-ajax';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { type Entity, type SharedData, type Timezone } from '@/types';
import { useForm } from '@inertiajs/react';
import { CheckIcon, Loader2 } from 'lucide-react';
import { FormEventHandler, ReactNode, useRef } from 'react';
import { toast } from 'sonner';

type SiteForm = {
    entity: string;
    entity_name: string;
    code: string;
    name: string;
    address?: string | null;
    timezone: string;
    is_active: boolean;
};

interface CreateProps {
    timezones: Timezone[];
    onFormClosed?: () => void;
    onCreated?: () => void;
    onError?: (data: any) => void;
}

const Create = ({ timezones, onFormClosed, onCreated, onError }: CreateProps): ReactNode => {
    /*** inertia js ***/
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<Required<SiteForm>>({
        entity: '',
        entity_name: '',
        code: '',
        name: '',
        address: null,
        timezone: 'Asia/Jakarta', // default timezone
        is_active: true,
    });

    /*** references ***/
    const lovDialogEntity = useRef<DialogContainerRef>(null);
    const lovDataTableEntity = useRef<DataTablePaginationAjaxRef>(null);

    /*** events ***/
    const submitForm: FormEventHandler = async (e: React.FormEvent<Element>) => {
        e.preventDefault();

        post(route('config.setup.site.store'), {
            onSuccess: async (response) => {
                const props = response.props as unknown as SharedData;
                const flash = props.flash;
                if (flash.toast) toast.success(flash.toast.title, { description: flash.toast.message });
                if (onCreated) onCreated();

                // confirmation create new data
                const confirmation = await confirmDialog.YesNo({ message: 'Create new site?' });
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
            preserveState: true,
        });
    };

    const resetForm = (): void => {
        reset(); // clear form to initial values
        clearErrors(); // clear errors
    };

    const handleLOVRowSelected = (data: Entity): void => {
        setData('entity', data.id);
        setData('entity_name', data.name);
        lovDialogEntity.current?.close();
    };

    return (
        <>
            <div className="px-4">
                <form onSubmit={submitForm} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="code">
                            Entity <Label className="text-red-500">*</Label>
                        </Label>
                        <InputLOV
                            id="entity"
                            type="text"
                            autoFocus
                            tabIndex={1}
                            valueDisplay={data.entity_name}
                            placeholder="Entity"
                            error={errors.entity}
                            onSearchClick={() => lovDialogEntity.current?.open()}
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
                            maxLength={6}
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
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            tabIndex={4}
                            autoComplete="address"
                            value={data.address ?? ''}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Address"
                            error={errors.address}
                            maxLength={100}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="timezone">
                            Timezone <Label className="text-red-500">*</Label>
                        </Label>
                        <ComboBox
                            className="min-w-full"
                            placeholder="Timezone"
                            defValue={data.timezone}
                            items={timezones.map((item) => {
                                return { value: item.value, label: item.text };
                            })}
                            onValueChange={(value) => setData('timezone', value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="is_active">Active</Label>
                        <div className="flex">
                            <Checkbox
                                id="is_active"
                                name="is_active"
                                tabIndex={6}
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
            </div>

            {/* lov - entity */}
            <DialogContainer title="Entity List" ref={lovDialogEntity} className="md:min-w-3xl">
                <DataTablePaginationAjax
                    pagingType="simple"
                    url={route('dt.config.setup.entity', { is_active: true })}
                    ref={lovDataTableEntity}
                    columnDefs={LovEntityColumns}
                    containerClass="rounded-sm border"
                    scrollAreaClass="md:h-[425px]"
                    rowId="id"
                    onCancel={() => lovDialogEntity.current?.close()}
                    onRowSelected={handleLOVRowSelected}
                />
            </DialogContainer>
        </>
    );
};

export default Create;
