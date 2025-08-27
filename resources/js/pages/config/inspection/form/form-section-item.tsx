import Select from '@/components/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InspectionFormSection, type InspectionFormItem } from '@/types';
import { InspectionItemType } from '@/types/enum';
import { useForm } from '@inertiajs/react';
import { CheckIcon, Loader2 } from 'lucide-react';
import { FormEventHandler, ReactNode, useEffect } from 'react';

type FormSectionItemProps = {
    onSubmit: (data: InspectionFormItem) => void;
    inspectionFormSectionData?: InspectionFormSection;
    inspectionFormSectionItemData?: InspectionFormItem;
};

const FormSectionItem = ({ onSubmit, inspectionFormSectionData, inspectionFormSectionItemData }: FormSectionItemProps): ReactNode => {
    /*** inertia js ***/
    const { data, setData, clearErrors, processing, reset } = useForm<InspectionFormItem>({
        id: '',
        inspection_form_section_id: typeof inspectionFormSectionData === 'undefined' ? '' : inspectionFormSectionData.id,
        description: '',
        type: InspectionItemType.SELECT,
        order: 1,
    });

    /*** componenet effect ***/
    useEffect(() => {
        if (inspectionFormSectionItemData) {
            setData(inspectionFormSectionItemData);
        } else {
            resetForm();
        }
    }, [inspectionFormSectionItemData]);

    /*** events ***/
    const resetForm = () => {
        reset();
        clearErrors();
        setData({
            id: '',
            inspection_form_section_id: typeof inspectionFormSectionData === 'undefined' ? '' : inspectionFormSectionData.id,
            description: '',
            type: InspectionItemType.SELECT,
            order: 1,
        });
    };

    const submitForm: FormEventHandler = (e: React.FormEvent<Element>) => {
        e.preventDefault();

        onSubmit(data);
        resetForm();
    };

    return (
        <form onSubmit={submitForm}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="section" className="text-right">
                        Section
                    </Label>
                    <Input
                        id="section"
                        name="section"
                        type="text"
                        placeholder="Section"
                        value={inspectionFormSectionData ? inspectionFormSectionData.description : ''}
                        className="col-span-3 border-none p-0"
                        readOnly
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                        Description <Label className="text-red-500">*</Label>
                    </Label>
                    <Input
                        id="description"
                        name="description"
                        type="text"
                        placeholder="Description"
                        className="col-span-3"
                        maxLength={100}
                        required
                        onChange={(e) => setData('description', e.target.value)}
                        value={data.description}
                        autoFocus
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                        Type <Label className="text-red-500">*</Label>
                    </Label>
                    <Select
                        className="col-span-3"
                        placeholder="Type"
                        selectLabel="Type"
                        value={data.type}
                        onValueChange={(value) => value && setData('type', value as InspectionItemType)}
                        items={Object.entries(InspectionItemType).map(([label, value]) => {
                            return { value: value, label: label };
                        })}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="order" className="text-right">
                        Order <Label className="text-red-500">*</Label>
                    </Label>
                    <Input
                        id="order"
                        name="order"
                        type="number"
                        placeholder="Order"
                        className="col-span-3"
                        required
                        onChange={(e) => setData('order', Number(e.target.value))}
                        value={data.order}
                    />
                </div>
            </div>
            <div className="flex w-full justify-end">
                <Button type="submit" disabled={processing} variant={'outline'}>
                    {processing ? <Loader2 className="mr-2 size-4 animate-spin" /> : <CheckIcon className="mr-2 h-4 w-4" />}
                    Save
                </Button>
            </div>
        </form>
    );
};

export default FormSectionItem;
