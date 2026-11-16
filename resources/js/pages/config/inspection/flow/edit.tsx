import { errorDialog } from '@/components/error-dialog';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { InspectionCategoryDT, type SharedData } from '@/types';
import { useForm } from '@inertiajs/react';
import axios, { HttpStatusCode } from 'axios';
import { CheckIcon, Loader2, XIcon } from 'lucide-react';
import { ReactNode, SubmitEvent, useEffect } from 'react';
import { toast } from 'sonner';

type InputForm = {
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
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm<Required<InputForm>>({
        code: '',
        name: '',
        is_active: true,
    });

    /*** effects ***/
    useEffect(() => {
        if (id === null) return;
        fetchData();
    }, [id]);

    /*** events ***/
    const fetchData = async () => {
        const response = await axios.get(route('config.inspection.category.show', { id: id }));
        if (![HttpStatusCode.Ok].includes(response.status)) {
            toast.warning('Warning', { description: response.data.message });
            return;
        }

        const data: InspectionCategoryDT = response.data.data;

        setData(data);
    };

    const submitForm = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        put(route('config.inspection.category.update', { id: id }), {
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

    return (
        <>
            <div className="px-2">
                {!data.code ? (
                    <Spinner />
                ) : (
                    <form onSubmit={submitForm} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">
                                Code <Label className="text-red-500">*</Label>
                            </Label>
                            <Input
                                id="code"
                                type="text"
                                tabIndex={1}
                                autoComplete="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                placeholder="Email"
                                error={errors.code}
                                maxLength={50}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Name <Label className="text-red-500">*</Label>
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                tabIndex={2}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Name"
                                error={errors.name}
                                maxLength={100}
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
        </>
    );
};

export default Edit;
