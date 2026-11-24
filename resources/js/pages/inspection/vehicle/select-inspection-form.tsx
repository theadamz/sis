import ComboBox from '@/components/combo-box';
import ComboBoxCustomOption from '@/components/combo-box-custom-option';
import { ComboBoxInspectionFormOption, ComboBoxInspectionFormOptionSelected } from '@/components/combo-box-templates/inspection';
import { confirmDialog } from '@/components/confirm-dialog';
import { errorDialog } from '@/components/error-dialog';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { InspectionCategory, InspectionFormOption, type SharedData } from '@/types';
import { Fieldset } from '@headlessui/react';
import { router, useForm } from '@inertiajs/react';
import { CheckIcon, Loader2, XIcon } from 'lucide-react';
import { ReactNode, SubmitEvent, useState } from 'react';
import { toast } from 'sonner';

interface SelectInspectionForm {
    inspection_category: string;
    inspection_form: string;
}

interface SelectInspectionFormProps {
    onFormClosed?: () => void;
    onCreated?: () => void;
    onError?: (data: any) => void;
    inspectionCategories: Array<InspectionCategory>;
    inspectionForms?: Array<InspectionFormOption>;
}

const SelectInspectionForm = ({ onFormClosed, onCreated, onError, inspectionCategories, inspectionForms }: SelectInspectionFormProps): ReactNode => {
    /*** inertia js ***/
    const { data, setData, post, put, processing, errors, reset, clearErrors, isDirty } = useForm<SelectInspectionForm>();

    /*** states ***/
    const [loadingState, setLoadingState] = useState<string>('');

    /*** events ***/
    const submitForm = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('inspection.vehicle.store'), {
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
    };

    const resetForm = (): void => {
        reset(); // clear form to initial values
        clearErrors(); // clear errors
        setData({});
    };

    const handleCloseForm = async () => {
        resetForm();
        if (onFormClosed) onFormClosed();
    };

    const handleRetrivingOptions = async (loadingState: string, onlyRetrives: string[], data: any) => {
        router.visit(window.location.pathname, {
            only: onlyRetrives,
            data: data,
            preserveUrl: true,
            preserveState: true,
            onStart: () => setLoadingState(loadingState),
            onFinish: () => setLoadingState(''),
        });
    };

    return (
        <>
            <form onSubmit={submitForm}>
                <FieldGroup>
                    <Fieldset>
                        <FieldGroup className="grid gap-4">
                            <Field>
                                <FieldLabel htmlFor="inspection_category">
                                    Inspection Category <Label className="text-red-500">*</Label>
                                </FieldLabel>
                                <ComboBox
                                    className="min-w-full"
                                    placeholder="Select Inspection Category"
                                    defValue={data.inspection_category}
                                    onValueChange={(value) => {
                                        setData({
                                            inspection_category: value,
                                            inspection_form: '',
                                        });

                                        inspectionForms = [];

                                        handleRetrivingOptions('form', ['inspectionForms'], {
                                            inspection_category: value,
                                        });
                                    }}
                                    items={inspectionCategories.map((item) => {
                                        return { value: item.id, label: `${item.code} - ${item.name}` };
                                    })}
                                    error={errors.inspection_category}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="inspection_form">
                                    Inspection Form <Label className="text-red-500">*</Label>
                                </FieldLabel>
                                {loadingState === 'form' ? (
                                    <Spinner />
                                ) : (
                                    <ComboBoxCustomOption
                                        className="min-w-full"
                                        placeholder="Select Inspection Form"
                                        defValue={data.inspection_form}
                                        onValueChange={(value: InspectionFormOption) => setData('inspection_form', value.id)}
                                        items={!inspectionForms ? [] : inspectionForms}
                                        error={errors.inspection_form}
                                        optionComponent={ComboBoxInspectionFormOption}
                                        selectedOptionComponent={ComboBoxInspectionFormOptionSelected}
                                    />
                                )}
                            </Field>
                        </FieldGroup>
                    </Fieldset>
                    <FieldSeparator className="h-2" />
                    <Field orientation={'horizontal'} className="flex justify-between">
                        <Button type="button" disabled={processing} variant={'default'} onClick={handleCloseForm}>
                            <XIcon className="mr-2 size-4" />
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} variant={'outline'}>
                            {processing ? <Loader2 className="mr-2 size-4 animate-spin" /> : <CheckIcon className="mr-2 size-4" />}
                            Create Inspection
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </>
    );
};

export default SelectInspectionForm;
