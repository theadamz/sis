import { confirmDialog } from '@/components/confirm-dialog';
import { errorDialog } from '@/components/error-dialog';
import Select from '@/components/select';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { type SharedData } from '@/types';
import { ActionForm } from '@/types/enum';
import { Fieldset } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { CheckIcon, Loader2, XIcon } from 'lucide-react';
import { ReactNode, SubmitEvent, useEffect } from 'react';
import { toast } from 'sonner';

interface InputForm {
    id?: string;
    ownership: string;
    reg_no: string;
    owner_name?: string;
    owner_address?: string;
    paper_no?: string;
    brand?: string;
    type?: string;
    category?: string;
    model?: string;
    production_year?: number;
    power_capacity?: number;
    chassis_no?: string;
    engine_no?: string;
    color?: string;
    fuel_type?: string;
    license_plate_color?: string;
    registration_year?: number;
    registered_for?: string;
}

const InputFormEmpty: InputForm = {
    id: '',
    ownership: '',
    reg_no: '',
    owner_name: '',
    owner_address: '',
    paper_no: '',
    brand: '',
    type: '',
    category: '',
    model: '',
    production_year: undefined,
    power_capacity: undefined,
    chassis_no: '',
    engine_no: '',
    color: '',
    fuel_type: '',
    license_plate_color: '',
    registration_year: undefined,
    registered_for: '',
};

interface FormInputProps {
    onFormClosed?: () => void;
    onCreated?: () => void;
    onUpdated?: () => void;
    onError?: (data: any) => void;
    vehicleOwnerships: Array<{ value: string; label: string }>;
    action: ActionForm;
    rec?: InputForm;
}

const FormInput = ({ onFormClosed, onCreated, onUpdated, onError, vehicleOwnerships, action, rec }: FormInputProps): ReactNode => {
    /*** inertia js ***/
    const { data, setData, post, put, processing, errors, reset, clearErrors, isDirty } = useForm<InputForm>(rec ?? InputFormEmpty);

    /*** effect ***/
    useEffect(() => {
        if (action === ActionForm.create) {
            resetForm();
        }
    }, [action]);

    /*** events ***/
    const submitForm = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (action === ActionForm.edit) {
            put(route('inspection.vehicle.registered-vehicle.update', { id: data.id }), {
                onSuccess: async (response) => {
                    const props = response.props as unknown as SharedData;
                    const flash = props.flash;
                    if (flash.toast) toast.success(flash.toast.title, { description: flash.toast.message });
                    if (onUpdated) onUpdated();
                    if (onFormClosed) onFormClosed();
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
                only: ['datatable'],
            });
        } else {
            post(route('inspection.vehicle.registered-vehicle.store'), {
                onSuccess: async (response) => {
                    const props = response.props as unknown as SharedData;
                    const flash = props.flash;
                    if (flash.toast) toast.success(flash.toast.title, { description: flash.toast.message });
                    if (onCreated) onCreated();

                    // confirmation create new data
                    const confirmation = await confirmDialog.YesNo({ message: 'Create new?' });
                    if (confirmation) {
                        resetForm();
                    } else {
                        handleCloseForm();
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
                only: ['datatable'],
            });
        }
    };

    const resetForm = (): void => {
        reset(); // clear form to initial values
        clearErrors(); // clear errors
        setData(InputFormEmpty);
    };

    const handleCloseForm = async () => {
        resetForm();
        if (onFormClosed) onFormClosed();
    };

    return (
        <>
            <form onSubmit={submitForm}>
                <FieldGroup>
                    <Fieldset>
                        <FieldGroup id="inputContainer" className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="ownersip">
                                    Ownership <Label className="text-red-500">*</Label>
                                </FieldLabel>
                                <Select
                                    placeholder="Ownership"
                                    selectLabel="Select Ownership"
                                    value={data.ownership}
                                    onValueChange={(value) => setData('ownership', value)}
                                    items={vehicleOwnerships}
                                    error={errors.ownership}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="reg_no">
                                    Registration No. <Label className="text-red-500">*</Label>
                                </FieldLabel>
                                <Input
                                    id="reg_no"
                                    type="text"
                                    placeholder="Registration No."
                                    value={data.reg_no}
                                    onChange={(e) => setData('reg_no', e.target.value.toUpperCase())}
                                    error={errors.reg_no}
                                    maxLength={50}
                                />
                            </Field>
                            <Field className="col-span-2">
                                <FieldLabel htmlFor="registered_for">Registered For</FieldLabel>
                                <Input
                                    id="registered_for"
                                    type="text"
                                    placeholder="Registered For"
                                    value={data.registered_for ?? ''}
                                    onChange={(e) => setData('registered_for', e.target.value.toUpperCase())}
                                    error={errors.registered_for}
                                    maxLength={255}
                                />
                            </Field>
                        </FieldGroup>
                    </Fieldset>
                    <FieldSeparator className="h-2" />
                    <Fieldset>
                        <FieldLegend className="mb-2">Vehicle Information</FieldLegend>
                        <FieldDescription className="pb-3">Base on the paper registration</FieldDescription>
                        <ScrollArea className="h-80 rounded-sm border p-4" type="always">
                            <FieldGroup className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="owner_name">Owner Name</FieldLabel>
                                    <Input
                                        id="owner_name"
                                        type="text"
                                        placeholder="Ex: Michael owen"
                                        value={data.owner_name ?? ''}
                                        onChange={(e) => setData('owner_name', e.target.value.toUpperCase())}
                                        error={errors.owner_name}
                                        maxLength={255}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="owner_address">Owner Address</FieldLabel>
                                    <Input
                                        id="owner_address"
                                        type="text"
                                        placeholder="Ex: Something street..."
                                        value={data.owner_address ?? ''}
                                        onChange={(e) => setData('owner_address', e.target.value.toUpperCase())}
                                        error={errors.owner_address}
                                        maxLength={255}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="paper_no">Paper No.</FieldLabel>
                                    <Input
                                        id="paper_no"
                                        type="text"
                                        placeholder="Ex: XYZ123"
                                        value={data.paper_no ?? ''}
                                        onChange={(e) => setData('paper_no', e.target.value.toUpperCase())}
                                        error={errors.paper_no}
                                        maxLength={255}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="brand">Brand</FieldLabel>
                                    <Input
                                        id="brand"
                                        type="text"
                                        placeholder="Ex: YAMAHA"
                                        value={data.brand ?? ''}
                                        onChange={(e) => setData('brand', e.target.value.toUpperCase())}
                                        error={errors.brand}
                                        maxLength={255}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="type">Type</FieldLabel>
                                    <Input
                                        id="type"
                                        type="text"
                                        placeholder="Ex: 2DP NON ABS"
                                        value={data.type ?? ''}
                                        onChange={(e) => setData('type', e.target.value.toUpperCase())}
                                        error={errors.type}
                                        maxLength={255}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="category">Category</FieldLabel>
                                    <Input
                                        id="category"
                                        type="text"
                                        placeholder="Ex: MOTORCYLE"
                                        value={data.category ?? ''}
                                        onChange={(e) => setData('category', e.target.value.toUpperCase())}
                                        error={errors.category}
                                        maxLength={255}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="model">Model</FieldLabel>
                                    <Input
                                        id="model"
                                        type="text"
                                        placeholder="Ex: SOLO MOTORCYLE"
                                        value={data.model ?? ''}
                                        onChange={(e) => setData('model', e.target.value.toUpperCase())}
                                        error={errors.model}
                                        maxLength={255}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="power_capacity">Power Capacity</FieldLabel>
                                    <Input
                                        id="power_capacity"
                                        type="number"
                                        placeholder="Ex: Cylinder capacity / Electrical power"
                                        value={data.power_capacity ?? ''}
                                        onChange={(e) => setData('power_capacity', Number(e.target.value))}
                                        error={errors.power_capacity}
                                        maxLength={10}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="chassis_no">Chassis No.</FieldLabel>
                                    <Input
                                        id="chassis_no"
                                        type="text"
                                        placeholder="Ex: CHAS09812XYZ"
                                        value={data.chassis_no ?? ''}
                                        onChange={(e) => setData('chassis_no', e.target.value.toUpperCase())}
                                        error={errors.chassis_no}
                                        maxLength={255}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="engine_no">Engine No.</FieldLabel>
                                    <Input
                                        id="engine_no"
                                        type="text"
                                        placeholder="Ex: EGN098X"
                                        value={data.engine_no ?? ''}
                                        onChange={(e) => setData('engine_no', e.target.value.toUpperCase())}
                                        error={errors.engine_no}
                                        maxLength={255}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="production_year">Production Year</FieldLabel>
                                    <Input
                                        id="production_year"
                                        type="number"
                                        placeholder={`Ex: ${new Date().getFullYear()}`}
                                        value={data.production_year ?? undefined}
                                        onChange={(e) => setData('production_year', Number(e.target.value))}
                                        error={errors.production_year}
                                        maxLength={4}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="registration_year">Registration Year</FieldLabel>
                                    <Input
                                        id="registration_year"
                                        type="number"
                                        placeholder={`Ex: ${new Date().getFullYear()}`}
                                        value={data.registration_year ?? undefined}
                                        onChange={(e) => setData('registration_year', Number(e.target.value))}
                                        error={errors.registration_year}
                                        maxLength={10}
                                    />
                                </Field>
                                <div className="col-span-2">
                                    <FieldGroup className="grid grid-cols-3 gap-4">
                                        <Field>
                                            <FieldLabel htmlFor="color">Color</FieldLabel>
                                            <Input
                                                id="color"
                                                type="text"
                                                placeholder="Ex: Black"
                                                value={data.color ?? ''}
                                                onChange={(e) => setData('color', e.target.value.toUpperCase())}
                                                error={errors.color}
                                                maxLength={255}
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="color">License Plate Color</FieldLabel>
                                            <Input
                                                id="license_plate_color"
                                                type="text"
                                                placeholder="Ex: White"
                                                value={data.license_plate_color ?? ''}
                                                onChange={(e) => setData('license_plate_color', e.target.value.toUpperCase())}
                                                error={errors.license_plate_color}
                                                maxLength={255}
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="fuel_type">Fuel Type</FieldLabel>
                                            <Input
                                                id="fuel_type"
                                                type="text"
                                                placeholder="Ex: Gasoline"
                                                value={data.fuel_type ?? ''}
                                                onChange={(e) => setData('fuel_type', e.target.value.toUpperCase())}
                                                error={errors.fuel_type}
                                                maxLength={255}
                                            />
                                        </Field>
                                    </FieldGroup>
                                </div>
                            </FieldGroup>
                        </ScrollArea>
                    </Fieldset>
                    <FieldSeparator className="h-2" />
                    <Field orientation={'horizontal'} className="flex justify-between">
                        <Button type="button" disabled={processing} variant={'default'} onClick={handleCloseForm}>
                            <XIcon className="mr-2 size-4" />
                            Close
                        </Button>
                        <Button type="submit" disabled={processing} variant={'outline'}>
                            {processing ? <Loader2 className="mr-2 size-4 animate-spin" /> : <CheckIcon className="mr-2 size-4" />}
                            Save
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </>
    );
};

export default FormInput;
