import Select from '@/components/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type InspectionFormSection } from '@/types';
import { getInspectionStage, InspectionStage } from '@/types/enum';
import { useForm } from '@inertiajs/react';
import { CheckIcon, Loader2 } from 'lucide-react';
import { FormEventHandler, ReactNode, useEffect } from 'react';

type FormSectionProps = {
    onSubmit: (data: InspectionFormSection) => void;
    inspectionFormSectionData?: InspectionFormSection;
    sectionCount?: number;
};

const FormSection = ({ onSubmit, inspectionFormSectionData, sectionCount }: FormSectionProps): ReactNode => {
    /*** inertia js ***/
    const { data, setData, clearErrors, processing, reset } = useForm<InspectionFormSection>({
        id: '',
        inspection_form_id: '',
        stage: InspectionStage.CHECKED_IN,
        description: '',
        seq: sectionCount ? sectionCount + 1 : 1,
        is_separate_page: false,
    });

    /*** componenet effect ***/
    useEffect(() => {
        if (inspectionFormSectionData) {
            setData(inspectionFormSectionData);
        } else {
            resetForm();
        }
    }, [inspectionFormSectionData]);

    /*** events ***/
    const resetForm = () => {
        reset();
        clearErrors();
        setData({
            id: '',
            inspection_form_id: '',
            stage: InspectionStage.CHECKED_IN,
            description: '',
            seq: sectionCount ? sectionCount + 1 : 1,
            is_separate_page: false,
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
                    <Label htmlFor="stage" className="text-right">
                        Stage <Label className="text-red-500">*</Label>
                    </Label>
                    <Select
                        className="col-span-3"
                        placeholder="Stage"
                        selectLabel="Stage"
                        value={data.stage}
                        onValueChange={(value) => value && setData('stage', value as InspectionStage)}
                        items={Object.entries(InspectionStage).map(([label, value]) => {
                            return { value: value, label: getInspectionStage(value, 'label') };
                        })}
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
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="seq" className="text-right">
                        Order <Label className="text-red-500">*</Label>
                    </Label>
                    <Input
                        id="seq"
                        name="seq"
                        type="number"
                        placeholder="Order"
                        className="col-span-3"
                        required
                        onChange={(e) => setData('seq', Number(e.target.value))}
                        value={data.seq}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="seq" className="text-right">
                        Print Separate Page
                    </Label>
                    <Checkbox
                        className="col-span-3"
                        id="is_separate_page"
                        name="is_separate_page"
                        defaultChecked={data.is_separate_page}
                        checked={data.is_separate_page}
                        onCheckedChange={(e) => setData('is_separate_page', e.valueOf() as boolean)}
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

export default FormSection;
