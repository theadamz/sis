import { errorDialog } from '@/components/error-dialog';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { type SharedData, type UserAccess } from '@/types';
import { useForm } from '@inertiajs/react';
import axios, { HttpStatusCode } from 'axios';
import { CheckIcon, Loader2, XIcon } from 'lucide-react';
import { FormEventHandler, ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';

type UserAccessForm = {
    site: string;
    user: string;
    code: string;
    permissions: { [permisison: string]: boolean };
};

interface UserAccessPermissions extends UserAccess {
    permissions: { [permisison: string]: boolean };
}

type EditProps = {
    id: string | null;
    siteId?: string;
    userId?: string;
    onFormClosed?: () => void;
    onUpdated?: () => void;
    onError?: (data: any) => void;
};

const Edit = ({ id, siteId, userId, onFormClosed, onUpdated, onError }: EditProps): ReactNode => {
    /*** inertia js ***/
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm<Required<UserAccessForm>>({
        site: '',
        user: '',
        code: '',
        permissions: {},
    });

    /*** states ***/
    const [accessName, setAccessName] = useState<string>('');

    /*** effects ***/
    useEffect(() => {
        if (id === null) return;
        fetchData();
    }, [id]);

    /*** events ***/
    const fetchData = async () => {
        const response = await axios.get(route('config.access.read', { siteId: siteId, userId: userId, accessCode: id }), {
            validateStatus: () => true,
        });
        if (![HttpStatusCode.Ok].includes(response.status)) {
            toast.warning('Warning', { description: response.data.message });
            return;
        }

        const userAccess: UserAccessPermissions = response.data.data;

        setData({
            site: siteId ?? '',
            user: userId ?? '',
            code: id ?? '',
            permissions: userAccess.permissions,
        });

        setAccessName(userAccess.name);
    };

    const submitForm: FormEventHandler = (e: React.FormEvent<Element>) => {
        e.preventDefault();

        put(route('config.access.update'), {
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

    const handleCheckedItem = (permission: string, check: boolean) => {
        setData({
            ...data,
            ...{
                permissions: { ...data.permissions, [permission]: check },
            },
        });
    };

    return (
        <>
            {!data.code ? (
                <Spinner />
            ) : (
                <form onSubmit={submitForm} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="access_name">Access</Label>
                        <Input
                            id="access_name"
                            name="access_name"
                            type="text"
                            placeholder="Access"
                            className="focus-visible:ring-ring/50 border-none p-0 focus-visible:border-0 focus-visible:ring-[3px]"
                            value={accessName}
                            readOnly
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="access_name">Permissions</Label>
                        <div className="flex space-x-3">
                            {Object.entries(data.permissions).map(([permission, isAllowed]) => (
                                <div key={permission} className="flex items-center">
                                    <div className="flex items-center">
                                        <Checkbox
                                            id={permission}
                                            defaultChecked={isAllowed}
                                            value={permission}
                                            onCheckedChange={(e) => handleCheckedItem(permission, e.valueOf() as boolean)}
                                        />
                                        <Label htmlFor={permission} className="ms-2 me-1">
                                            {permission}
                                        </Label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {errors &&
                        Object.entries(errors).map((error, idx) => {
                            return (
                                <span key={error[0]} className="text-xs text-red-600 dark:text-red-500">
                                    {error}
                                </span>
                            );
                        })}
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
        </>
    );
};

export default Edit;
