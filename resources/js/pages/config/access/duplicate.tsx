import ComboBoxAjax, { ComboBoxAjaxRef } from '@/components/combo-box-ajax';
import ComboBoxAjaxMultiple, { ComboBoxAjaxMultipleRef } from '@/components/combo-box-ajax-multiple';
import { ComboBoxSiteOption, ComboBoxSiteOptionSelectedMulti } from '@/components/combo-box-templates/site';
import { ComboBoxUserOption, ComboBoxUserOptionSelected } from '@/components/combo-box-templates/user';
import { confirmDialog } from '@/components/confirm-dialog';
import { errorDialog } from '@/components/error-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { type Access, type SharedData, type SiteOption, type UserOption } from '@/types';
import { useForm } from '@inertiajs/react';
import { CheckIcon, Loader2, XIcon } from 'lucide-react';
import { FormEventHandler, ReactNode, useRef } from 'react';
import { toast } from 'sonner';

type UserAccessDuplicateForm = {
    from_user: string;
    to_user: string;
    exclude_sites: string[];
    exclude_accesses: string[];
};

interface DuplicateProps {
    accesses: Access[];
    onFormClosed?: () => void;
    onCreated?: () => void;
    onError?: (data: any) => void;
}

const Duplicate = ({ accesses, onFormClosed, onCreated, onError }: DuplicateProps): ReactNode => {
    /*** inertia js ***/
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<Required<UserAccessDuplicateForm>>({
        from_user: '',
        to_user: '',
        exclude_sites: [],
        exclude_accesses: [],
    });

    /*** references ***/
    const fromUserComboBoxRef = useRef<ComboBoxAjaxRef>(null);
    const toUserComboBoxRef = useRef<ComboBoxAjaxRef>(null);
    const excludeSiteComboBoxRef = useRef<ComboBoxAjaxMultipleRef>(null);

    /*** events ***/
    const submitForm: FormEventHandler = async (e: React.FormEvent<Element>) => {
        e.preventDefault();

        post(route('config.access.duplicate'), {
            onSuccess: async (response) => {
                const props = response.props as unknown as SharedData;
                const flash = props.flash;
                if (flash.toast) toast.success(flash.toast.title, { description: flash.toast.message });
                if (onCreated) onCreated();

                // confirmation create new data
                const confirmation = await confirmDialog.YesNo({ message: 'Duplicate access for other user?' });
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
        fromUserComboBoxRef.current?.clearOptions();
        toUserComboBoxRef.current?.clearOptions();
        excludeSiteComboBoxRef.current?.clearOptions();
    };

    const handleCheckedItem = (value: string, isChecked: boolean) => {
        if (!isChecked) {
            setData((prevData) => {
                return {
                    ...prevData,
                    exclude_accesses: prevData.exclude_accesses.filter((item) => value !== item),
                };
            });
        } else {
            setData((prevData) => {
                return {
                    ...prevData,
                    ...{ exclude_accesses: [...prevData.exclude_accesses, value] },
                };
            });
        }
    };

    return (
        <>
            <div className="px-2">
                <form onSubmit={submitForm} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>
                            From User <Label className="text-red-500">*</Label>
                        </Label>
                        <ComboBoxAjax
                            ref={fromUserComboBoxRef}
                            url={route('option.config.user')}
                            additionalQueryStrings={{ is_active: true }}
                            className="min-w-xs"
                            placeholder="Select user"
                            onValueChange={(data: UserOption) => {
                                setData('from_user', data.id);
                            }}
                            optionComponent={ComboBoxUserOption}
                            selectedOptionComponent={ComboBoxUserOptionSelected}
                            error={errors.from_user}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="user">
                            To User <Label className="text-red-500">*</Label>
                        </Label>
                        <ComboBoxAjax
                            ref={toUserComboBoxRef}
                            url={route('option.config.user')}
                            additionalQueryStrings={{ is_active: true }}
                            className="min-w-xs"
                            placeholder="Select user"
                            onValueChange={(data: UserOption) => {
                                setData('to_user', data.id);
                            }}
                            optionComponent={ComboBoxUserOption}
                            selectedOptionComponent={ComboBoxUserOptionSelected}
                            error={errors.to_user}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Exclude Sites</Label>
                        <ComboBoxAjaxMultiple
                            ref={excludeSiteComboBoxRef}
                            url={route('option.config.setup.site')}
                            additionalQueryStrings={{ is_active: true }}
                            className="min-w-xs"
                            placeholder="Select sites"
                            onValuesChange={(data: SiteOption[]) => {
                                setData(
                                    'exclude_sites',
                                    data.map((item) => item.id),
                                );
                            }}
                            optionComponent={ComboBoxSiteOption}
                            selectedOptionComponent={ComboBoxSiteOptionSelectedMulti}
                            error={errors.exclude_sites}
                            closedOnSelect={false}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Exclude Access</Label>
                        <Command className={`rounded-lg border shadow-md ${errors.exclude_accesses ? 'border-red-500' : ''}`}>
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
                                                    checked={data.exclude_accesses.includes(item.code)}
                                                />
                                                <Label htmlFor={item.code}>{item.name}</Label>
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                        {errors.exclude_accesses && <InputError message={errors.exclude_accesses} />}
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

export default Duplicate;
