import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import axios, { HttpStatusCode } from 'axios';
import _ from 'lodash';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { ForwardedRef, forwardRef, Fragment, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

export interface ComboBoxAjaxRef {
    getSelectedOption: () => any;
    clearOptions: () => void;
}

type QueryString = {
    page_type: 'page' | 'id' | 'none';
    keyword: string;
    per_page: number;
    page?: number;
    id?: any;
};

type ComboBoxAjaxProps = {
    url: string;
    additionalQueryStrings?: { [key: string]: any };
    valueColumn?: string;
    labelColumn?: string;
    pageType?: 'page' | 'id' | 'none';
    perPage?: number;
    defValue?: any;
    options?: Array<any>;
    className?: string;
    placeholder?: string;
    defOpen?: boolean;
    error?: string;
    showErrorMessage?: boolean;
    closedOnSelect?: boolean;
    onValueChange?: (value: any) => void;
    optionComponent?: (item: any) => ReactNode;
    selectedOptionComponent?: (item: any) => ReactNode;
};

const ComboBoxAjax = (
    {
        url,
        additionalQueryStrings,
        valueColumn = 'id',
        labelColumn = 'name',
        pageType = 'id',
        perPage = 10,
        defValue,
        options = [],
        defOpen = false,
        className,
        placeholder = 'Select',
        error,
        showErrorMessage = true,
        closedOnSelect = true,
        onValueChange,
        optionComponent,
        selectedOptionComponent,
    }: ComboBoxAjaxProps,
    ref: ForwardedRef<ComboBoxAjaxRef>,
): ReactNode => {
    /*** references ***/
    const commandListRef = useRef<HTMLDivElement>(null);

    /*** imperative ***/
    useImperativeHandle(ref, () => ({
        getSelectedOption: () => handleGetSelectedOption(),
        clearOptions: () => handleClearOptions(),
    }));

    /*** state ***/
    const [open, setOpen] = useState<boolean>(defOpen);
    const [value, setValue] = useState<any>(defValue);
    const [data, setData] = useState<any[]>(options);
    const [option, setOption] = useState<any>(null);
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
        setValue(defValue);
        setData(options);
        if (data.length > 0) {
            setOption(data[0]);
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

    const handleGetSelectedOption = () => {
        return option;
    };

    const handleClearOptions = () => {
        setValue(null);
        setOption(null);
        setData([]);
    };

    return (
        <Fragment>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn('justify-between', className, error ? 'border-red-500' : '', selectedOptionComponent && 'h-fit')}
                    >
                        {selectedOptionComponent && value ? selectedOptionComponent(option) : value ? option[labelColumn] : placeholder}
                        {isLoading ? (
                            <Loader2 className="h-3 w-3 shrink-0 animate-spin opacity-50" />
                        ) : (
                            <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
                        )}
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
                                            // get selected option from data state
                                            const selectedOption = data.find((item) => item[valueColumn] === selectedValue);

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

export default forwardRef<ComboBoxAjaxRef, ComboBoxAjaxProps>(ComboBoxAjax);
