import { SelectContent, SelectGroup, SelectItem, SelectLabel, Select as SelectRoot, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Fragment, ReactNode } from 'react';

type SelectProps = {
    className?: string;
    placeholder?: string;
    selectLabel?: string;
    items: Array<{ value: string; label: string }>;
    value: string | undefined;
    onValueChange?: (value: string) => void;
    error?: string;
    showErrorMessage?: boolean;
};

const Select = ({
    className,
    placeholder = 'Select',
    selectLabel = 'Select',
    items,
    value,
    onValueChange,
    error,
    showErrorMessage = true,
}: SelectProps): ReactNode => {
    return (
        <Fragment>
            <SelectRoot value={value} onValueChange={onValueChange}>
                <SelectTrigger className={cn(className, error ? 'border-red-500' : '')}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{selectLabel}</SelectLabel>
                        {items.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </SelectRoot>
            {error && showErrorMessage && <span className="text-xs text-red-600 dark:text-red-500">{error}</span>}
        </Fragment>
    );
};

export default Select;
