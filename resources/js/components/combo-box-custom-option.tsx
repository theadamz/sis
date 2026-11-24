import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import _ from 'lodash';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Fragment, ReactNode, useEffect, useState } from 'react';
import { Label } from './ui/label';

type ComboBoxCustomOptionProps = {
    className?: string;
    placeholder?: string;
    defOpen?: boolean;
    items: Array<any>;
    filterItemKey?: string;
    defValue?: string;
    onValueChange?: (value: any) => void;
    error?: string;
    showErrorMessage?: boolean;
    optionComponent?: (item: any) => ReactNode;
    selectedOptionComponent?: (item: any) => ReactNode;
    valueColumn?: string;
    labelColumn?: string;
    closedOnSelect?: boolean;
};

const ComboBoxCustomOption = ({
    className,
    placeholder = 'Select',
    defOpen = false,
    items,
    filterItemKey = 'name',
    defValue = '',
    onValueChange,
    error,
    showErrorMessage = true,
    optionComponent,
    selectedOptionComponent,
    valueColumn = 'id',
    labelColumn = 'name',
    closedOnSelect = true,
}: ComboBoxCustomOptionProps): ReactNode => {
    /*** state ***/
    const [option, setOption] = useState<any>(null);
    const [open, setOpen] = useState(defOpen);
    const [value, setValue] = useState<any>(defValue);

    /*** effect ***/
    useEffect(() => {
        setValue(defValue);
    }, [defValue]);

    return (
        <Fragment>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(className, error ? 'border-red-500' : '', selectedOptionComponent && 'h-fit')}
                    >
                        <div className="flex w-full justify-between">
                            {selectedOptionComponent && value ? (
                                selectedOptionComponent(option)
                            ) : value ? (
                                option[labelColumn]
                            ) : (
                                <Label>{placeholder}</Label>
                            )}
                            <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={cn('w-(--radix-popover-trigger-width) p-0', className)}>
                    <Command
                        filter={(value: string, search: string) => {
                            if (filterItemKey === 'value') {
                                return _.startsWith(value, search) ? 1 : 0;
                            } else {
                                const filters = _.transform(
                                    items,
                                    (result: string[], value) => {
                                        if (value[filterItemKey].toLowerCase().includes(search.toLowerCase())) {
                                            result.push(value.value);
                                        }
                                    },
                                    [],
                                );

                                return filters.includes(value) ? 1 : 0;
                            }
                        }}
                    >
                        <CommandInput placeholder="Search..." />
                        <CommandList>
                            <CommandEmpty>Not found.</CommandEmpty>
                            <CommandGroup className="p-0">
                                {items.map((item, idx) => (
                                    <CommandItem
                                        key={idx}
                                        value={item[valueColumn]}
                                        onSelect={(selectedValue) => {
                                            // get selected option from data state
                                            const selectedOption = items.find((item) => item[valueColumn] === selectedValue);

                                            // set option
                                            setOption(selectedOption);

                                            // set value
                                            setValue(selectedValue === value ? null : selectedValue);

                                            // if onValueChange is defined then send selected option
                                            if (onValueChange) onValueChange(selectedOption);

                                            // close command list when closedOnSelect if defined
                                            if (closedOnSelect) setOpen(false);
                                        }}
                                    >
                                        {optionComponent ? optionComponent(item) : item[labelColumn]}
                                        <Check className={cn('mr-2 h-4 w-4', value === item[valueColumn] ? 'opacity-100' : 'opacity-0')} />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && showErrorMessage && <span className="text-xs text-red-600 dark:text-red-500">{error}</span>}
        </Fragment>
    );
};

export default ComboBoxCustomOption;
