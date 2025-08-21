import ComboBoxAjax, { ComboBoxAjaxRef } from '@/components/combo-box-ajax';
import { ComboBoxSiteOption, ComboBoxSiteOptionSelected } from '@/components/combo-box-templates/site';
import { ComboBoxUserOption, ComboBoxUserOptionSelected } from '@/components/combo-box-templates/user';
import { confirmDialog } from '@/components/confirm-dialog';
import { errorDialog } from '@/components/error-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { SiteOption, UserOption, type Access, type SharedData } from '@/types';
import { useForm } from '@inertiajs/react';
import { CheckIcon, Loader2, XIcon } from 'lucide-react';
import { FormEventHandler, ReactNode, useRef } from 'react';
import { toast } from 'sonner';
import InputError from '../../../components/input-error';

type UserAccessForm = {
    site: string;
    user: string;
    access_lists: string[];
};

interface CreateProps {
    accesses: Access[];
    onFormClosed?: () => void;
    onCreated?: () => void;
    onError?: (data: any) => void;
}

const Create = ({ accesses, onFormClosed, onCreated, onError }: CreateProps): ReactNode => {
    /*** inertia js ***/
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<Required<UserAccessForm>>({
        site: '',
        user: '',
        access_lists: [],
    });

    /*** references ***/
    const siteComboBoxRef = useRef<ComboBoxAjaxRef>(null);
    const userComboBoxRef = useRef<ComboBoxAjaxRef>(null);

    /*** events ***/
    const submitForm: FormEventHandler = async (e: React.FormEvent<Element>) => {
        e.preventDefault();

        post(route('config.access.store'), {
            onSuccess: async (response) => {
                const props = response.props as unknown as SharedData;
                const flash = props.flash;
                if (flash.toast) toast.success(flash.toast.title, { description: flash.toast.message });
                if (onCreated) onCreated();

                // confirmation create new data
                const confirmation = await confirmDialog.YesNo({ message: 'Create access for other user?' });
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
        });
    };

    const resetForm = (): void => {
        reset(); // clear form to initial values
        clearErrors(); // clear errors
        siteComboBoxRef.current?.clearOptions();
        userComboBoxRef.current?.clearOptions();
        setData({
            site: '',
            user: '',
            access_lists: [],
        });
    };

    const handleCheckedItem = (value: string, isChecked: boolean) => {
        if (!isChecked) {
            setData((prevData) => {
                return {
                    ...prevData,
                    access_lists: prevData.access_lists.filter((item) => value !== item),
                };
            });
        } else {
            setData((prevData) => {
                return {
                    ...prevData,
                    ...{ access_lists: [...prevData.access_lists, value] },
                };
            });
        }
    };

    return (
        <>
            <div className="px-2">
                <form onSubmit={submitForm} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="user">
                            Site <Label className="text-red-500">*</Label>
                        </Label>
                        <ComboBoxAjax
                            ref={siteComboBoxRef}
                            url={route('option.config.setup.site')}
                            additionalQueryStrings={{ is_active: true }}
                            className="me-2 min-w-xs"
                            placeholder="Select site"
                            onValueChange={(data: SiteOption) => {
                                setData('site', data.id);
                            }}
                            optionComponent={ComboBoxSiteOption}
                            selectedOptionComponent={ComboBoxSiteOptionSelected}
                            error={errors.site}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="user">
                            User <Label className="text-red-500">*</Label>
                        </Label>
                        <ComboBoxAjax
                            ref={userComboBoxRef}
                            url={route('option.config.user')}
                            additionalQueryStrings={{ is_active: true }}
                            className="min-w-xs"
                            placeholder="Select user"
                            onValueChange={(data: UserOption) => {
                                setData('user', data.id);
                            }}
                            optionComponent={ComboBoxUserOption}
                            selectedOptionComponent={ComboBoxUserOptionSelected}
                            error={errors.user}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">
                            Select one or more access <Label className="text-red-500">*</Label>
                        </Label>
                        <Command className={`rounded-lg border shadow-md ${errors.access_lists ? 'border-red-500' : ''}`}>
                            <CommandInput placeholder="Search" />
                            <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup>
                                    {accesses.map((item) => {
                                        return (
                                            <CommandItem key={item.code} className="space-x-2">
                                                <Checkbox
                                                    id={item.code}
                                                    value={item.code}
                                                    onCheckedChange={(e) => handleCheckedItem(item.code, e.valueOf() as boolean)}
                                                    checked={data.access_lists.includes(item.code)}
                                                />
                                                <Label htmlFor={item.code}>{item.name}</Label>
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                        {errors.access_lists && <InputError message={errors.access_lists} />}
                    </div>
                    <div className="grid gap-2">
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
            </div>
        </>
    );
};

export default Create;
