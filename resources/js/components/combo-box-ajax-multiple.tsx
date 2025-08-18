import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import axios, { HttpStatusCode } from 'axios';
import _ from 'lodash';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { ForwardedRef, forwardRef, Fragment, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

export interface ComboBoxAjaxMultipleRef {
    getSelectedOptions: () => any;
    clearOptions: () => void;
}

type QueryString = {
    page_type: 'page' | 'id' | 'none';
    keyword: string;
    per_page: number;
    page?: number;
    id?: any;
};

type ComboBoxAjaxMultipleProps = {
    url: string;
    additionalQueryStrings?: { [key: string]: any };
    valueColumn?: string;
    labelColumn?: string;
    pageType?: 'page' | 'id' | 'none';
    perPage?: number;
    defValues?: any[];
    options?: Array<any>;
    className?: string;
    placeholder?: string;
    defOpen?: boolean;
    error?: string;
    showErrorMessage?: boolean;
    closedOnSelect?: boolean;
    maxPreviewOption?: number;
    separator?: string | ReactNode;
    onValuesChange?: (value: any) => void;
    optionComponent?: (item: any) => ReactNode;
    selectedOptionComponent?: (item: any) => ReactNode;
};

const ComboBoxAjaxMultiple = (
    {
        url,
        additionalQueryStrings,
        valueColumn = 'id',
        labelColumn = 'name',
        pageType = 'id',
        perPage = 10,
        defValues,
        options = [],
        defOpen = false,
        className,
        placeholder = 'Select',
        error,
        showErrorMessage = true,
        closedOnSelect = true,
        maxPreviewOption = 3,
        separator = ', ',
        onValuesChange,
        optionComponent,
        selectedOptionComponent,
    }: ComboBoxAjaxMultipleProps,
    ref: ForwardedRef<ComboBoxAjaxMultipleRef>,
): ReactNode => {
    /*** references ***/
    const commandListRef = useRef<HTMLDivElement>(null);

    /*** imperative ***/
    useImperativeHandle(ref, () => ({
        getSelectedOptions: () => handleGetSelectedOptions(),
        clearOptions: () => handleClearOptions(),
    }));

    /*** state ***/
    const [open, setOpen] = useState<boolean>(defOpen);
    const [values, setValues] = useState<any[]>(defValues ?? []);
    const [data, setData] = useState<any[]>(options);
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
    const [query, setQuery] = useState<QueryString>({
        page_type: pageType,
        keyword: '',
        per_page: perPage,
        page: pageType === 'page' ? 1 : undefined,
        id: undefined,
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>('');

    /*** effect ***/
    useEffect(() => {
        setValues(defValues ?? []);
        setData(options);
        if (data.length > 0) {
            setSelectedOptions(options);
        }
    }, []);

    useEffect(() => {
        if (commandListRef.current) commandListRef.current.addEventListener('scroll', handleScroll);

        return () => {
            if (commandListRef.current) commandListRef.current.removeEventListener('scroll', handleScroll);
        };
    }, [commandListRef.current]);

    useEffect(() => {
        if (open === true && data.length <= 0) fetchData(query);
        if (open === true && data.length > 0 && hasMore) fetchData(query);
        if (open === false) setHasMore(false);
    }, [open, query]);

    useEffect(() => {
        if (onValuesChange) onValuesChange(selectedOptions);
    }, [selectedOptions]);

    /*** events ***/
    const fetchData = async (queryStrings?: { [key: string]: any }) => {
        // set loading
        setIsLoading(true);

        // send request
        const response = await axios.get(url, { params: { ...queryStrings, ...additionalQueryStrings } });
        if (![HttpStatusCode.Ok].includes(response.status)) {
            setData([]);
            setIsLoading(false);
            setHasMore(false);
            return;
        }

        if (response.data.data.length > 0) {
            setData((prevData) => [...prevData, ...response.data.data]);
        }

        setHasMore(response.data.data.length > 0);

        // hide loading
        setIsLoading(false);
    };

    const handleScroll = () => {
        // if reference is empty then return
        if (!commandListRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = commandListRef.current;
        if (scrollTop + clientHeight >= scrollHeight) {
            if (query.page_type === 'page') {
                setQuery((prevQuery) => {
                    return {
                        ...prevQuery,
                        page: prevQuery.page ? prevQuery.page + 1 : undefined,
                    };
                });
            }

            if (query.page_type === 'id') {
                setData((prevData) => {
                    if (prevData.length > 0) {
                        setQuery({
                            ...query,
                            id: prevData[prevData.length - 1]['id'],
                        });
                    }

                    return prevData;
                });
            }
        }
    };

    const handleSearch = (keyword: string) => {
        // set keyword
        setQuery((prevQuery) => {
            // set data empty
            setData([]);

            if (pageType === 'id') {
                return {
                    ...prevQuery,
                    id: undefined,
                    keyword: keyword,
                };
            } else {
                return {
                    ...prevQuery,
                    page: 1,
                    keyword: keyword,
                };
            }
        });
    };

    const searchDebounce = useCallback(
        _.debounce((value: string) => handleSearch(value), 500),
        [],
    );

    const handleGetSelectedOptions = () => {
        return selectedOptions;
    };

    const handleClearOptions = () => {
        setValues([]);
        setSelectedOptions([]);
        setData([]);
    };

    const handleSelectedOptions = (item: any) => {
        setSelectedOptions((prevSelectedOptions) => {
            if (prevSelectedOptions.includes(item)) {
                return prevSelectedOptions.filter((option) => item[valueColumn] !== option[valueColumn]);
            }

            return [...prevSelectedOptions, item];
        });
    };

    const renderSelectedOptions = () => {
        // if values length <= 0 then just return the placeholder
        if (values.length <= 0) return placeholder;

        // if values length more than maxPreviewOption and maxPreviewOption more than 0 then just return the length and
        if (values.length > maxPreviewOption && maxPreviewOption > 0) return `${values.length} selected`;

        // if selectedOptionComponent is declared and values and length more than 0 then return it
        if (selectedOptionComponent && values.length > 0) {
            return selectedOptions.map((option, index) => <Fragment key={index}>{selectedOptionComponent(option)}</Fragment>);
        }

        // if values length > 0 then return the label
        if (values.length > 0) {
            return selectedOptions.map((item) => item[labelColumn]).join(separator as string);
        }
    };

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
                        <div className={cn('flex w-full items-center justify-between overflow-hidden')}>
                            <div className="flex justify-start">{renderSelectedOptions()}</div>
                            {isLoading ? (
                                <Loader2 className="h-3 w-3 shrink-0 animate-spin opacity-50" />
                            ) : (
                                <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
                            )}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={cn('w-[var(--radix-popover-trigger-width)] p-0', className)}>
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Search..."
                            onValueChange={(value: string) => {
                                searchDebounce(value);
                                setKeyword(value);
                            }}
                            value={keyword}
                        />
                        <CommandList ref={commandListRef}>
                            <CommandEmpty>{!isLoading ? 'Not found.' : 'Loading...'} </CommandEmpty>
                            <CommandGroup className="p-0">
                                {data.map((item, index) => (
                                    <CommandItem
                                        key={index}
                                        value={item[valueColumn]}
                                        onSelect={(selectedValue) => {
                                            // set values to check options
                                            setValues((prevValues) => {
                                                if (prevValues.includes(selectedValue as any)) {
                                                    return prevValues.filter((item) => item !== selectedValue);
                                                }

                                                return [...prevValues, selectedValue as any];
                                            });

                                            // get option data from state then push it to selectedOptions state
                                            const selectedOption = data.find((item) => item[valueColumn] === selectedValue);
                                            handleSelectedOptions(selectedOption);

                                            // when closedOnSelect is detected or has value true then close command list when option selected
                                            if (closedOnSelect) setOpen(false);
                                        }}
                                    >
                                        {optionComponent ? optionComponent(item) : item[labelColumn]}
                                        <Check className={cn('mr-2 h-4 w-4', values.includes(item[valueColumn]) ? 'opacity-100' : 'opacity-0')} />
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

export default forwardRef<ComboBoxAjaxMultipleRef, ComboBoxAjaxMultipleProps>(ComboBoxAjaxMultiple);
