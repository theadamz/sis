import { errorDialog } from '@/components/error-dialog';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { type SharedData, type VehicleType } from '@/types';
import { useForm } from '@inertiajs/react';
import axios, { HttpStatusCode } from 'axios';
import { CheckIcon, Loader2 } from 'lucide-react';
import { FormEventHandler, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

type VehicleTypeForm = {
    code: string;
    name: string;
    is_visible: boolean;
};

type EditProps = {
    id: string | null;
    onFormClosed?: () => void;
    onUpdated?: () => void;
    onError?: (data: any) => void;
};

const Edit = ({ id, onFormClosed, onUpdated, onError }: EditProps): ReactNode => {
    /*** inertia js ***/
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm<Required<VehicleTypeForm>>({
        code: '',
        name: '',
        is_visible: true,
    });

    /*** effects ***/
    useEffect(() => {
        if (id === null) return;
        fetchData();
    }, [id]);

    /*** events ***/
    const fetchData = async () => {
        const response = await axios.get(route('config.inspection.vehicle-type.show', { id: id }));
        if (![HttpStatusCode.Ok].includes(response.status)) {
            toast.warning('Warning', { description: response.data.message });
            return;
        }

        const data: VehicleType = response.data.data;

        setData({
            code: data.code,
            name: data.name,
            is_visible: data.is_visible,
        });
    };

    const submitForm: FormEventHandler = (e: React.FormEvent<Element>) => {
        e.preventDefault();

        put(route('config.inspection.vehicle-type.update', { id: id }), {
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
        <div className="px-4">
            {!data.code ? (
                <Spinner />
            ) : (
                <form onSubmit={submitForm} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="code">
                            Code <Label className="text-red-500">*</Label>
                        </Label>
                        <Input
                            id="code"
                            type="text"
                            autoFocus
                            tabIndex={1}
                            autoComplete="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            placeholder="Code"
                            error={errors.code}
                            maxLength={20}
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
                            maxLength={50}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="is_visible">Visible</Label>
                        <div className="flex">
                            <Checkbox
                                id="is_visible"
                                name="is_visible"
                                tabIndex={3}
                                defaultChecked={data.is_visible}
                                checked={data.is_visible}
                                onCheckedChange={(e) => setData('is_visible', e.valueOf() as boolean)}
                            />
                            <Label htmlFor="is_visible" className="ml-2">
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
    );
};

export default Edit;
