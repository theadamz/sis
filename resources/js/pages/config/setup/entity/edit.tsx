import { errorDialog } from '@/components/error-dialog';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { type Entity, type SharedData } from '@/types';
import { useForm } from '@inertiajs/react';
import axios, { HttpStatusCode } from 'axios';
import { CheckIcon, Loader2 } from 'lucide-react';
import { FormEventHandler, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

type EntityForm = {
    code: string;
    name: string;
    description?: string;
    is_active: boolean;
};

type EditProps = {
    id: string | null;
    onUpdated?: () => void;
    onError?: (data: any) => void;
};

const Edit = ({ id, onUpdated, onError }: EditProps): ReactNode => {
    /*** inertia js ***/
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm<Required<EntityForm>>({
        code: '',
        name: '',
        description: '',
        is_active: true,
    });

    /*** effects ***/
    useEffect(() => {
        if (id === null) return;
        fetchData();
    }, [id]);

    /*** events ***/
    const fetchData = async () => {
        const response = await axios.get(route('config.setup.entity.show', { id: id }));
        if (![HttpStatusCode.Ok].includes(response.status)) {
            toast.warning('Warning', { description: response.data.message });
            return;
        }

        const data: Entity = response.data.data;

        setData({
            code: data.code,
            name: data.name,
            description: data.description,
            is_active: data.is_active,
        });
    };

    const submitForm: FormEventHandler = (e: React.FormEvent<Element>) => {
        e.preventDefault();

        put(route('config.setup.entity.update', { id: id }), {
            onSuccess: async (response) => {
                const props = response.props as unknown as SharedData;
                const flash = props.flash;
                if (flash.toast) toast.success(flash.toast.title, { description: flash.toast.message });
                if (onUpdated) onUpdated();
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
                            maxLength={3}
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
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            tabIndex={3}
                            autoComplete="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Description"
                            error={errors.description}
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
