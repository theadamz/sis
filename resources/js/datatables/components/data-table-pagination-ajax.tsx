import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn, fuzzyFilter } from '@/lib/utils';
import { type SharedData } from '@/types';
import { type IDataTablePagination } from '@/types/datatables';
import { usePage } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table';
import axios, { HttpStatusCode } from 'axios';
import { debounce } from 'lodash';
import { EllipsisVerticalIcon, EyeIcon, MousePointer2Icon, MousePointerClickIcon, RotateCwIcon, Search, TrashIcon, XIcon } from 'lucide-react';
import numbro from 'numbro';
import { ForwardedRef, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import PaginationButtonsAjax from './pagination-buttons-ajax';

export interface DataTablePaginationAjaxRef {
    refresh: () => void;
    resetFilters: () => void;
    clearSelectedRows: () => void;
}

type AddiotionalQueryString = {
    [field: string]: any;
};

type DataTablePaginationAjaxProps<TData, TValue> = {
    rowId?: keyof TData;
    columnDefs: ColumnDef<TData, TValue>[];
    pagingType?: 'simple' | 'paging';
    url: string;
    containerClass?: string;
    scrollAreaClass?: string;
    useShowHideColumn?: boolean;
    useFirstAndLastPage?: boolean;
    additionalQueryStrings?: AddiotionalQueryString;
    onEdit?: (data: any) => void;
    onRowSelected?: (data: any) => void;
    onRowsSelected?: (data: any[]) => void;
    onDeleteClicked?: (data: any[]) => void;
    onCancel?: () => void;
};

type QueryFilter = {
    page: number;
    per_page: number;
    sort: { field: string; direction: 'asc' | 'desc' };
};

const dataPerPage: number[] = [10, 25, 50, 100];

const DataTablePaginationAjax = <TData, TValue>(
    {
        rowId = 'id' as keyof TData,
        columnDefs,
        pagingType = 'paging',
        url,
        containerClass,
        scrollAreaClass,
        useShowHideColumn = true,
        useFirstAndLastPage = true,
        additionalQueryStrings,
        onEdit,
        onRowSelected,
        onRowsSelected,
        onDeleteClicked,
        onCancel,
    }: DataTablePaginationAjaxProps<TData, TValue>,
    ref: ForwardedRef<DataTablePaginationAjaxRef>,
) => {
    /*** inertia js ***/
    const props = usePage<SharedData>().props;

    /*** componenet state ***/
    const searchParams = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState<string | undefined>(searchParams.get('search') ?? undefined);
    const [query, setQuery] = useState<QueryFilter>({ page: 1, per_page: 50, sort: { field: 'id', direction: 'asc' } });
    const [data, setData] = useState<IDataTablePagination<TData>>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [firstPage, setFirstPage] = useState<boolean>(true);
    const [selectedRows, setSelectedRows] = useState<TData[]>([]);

    /*** tanstack table ***/
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const columns = useMemo(() => columnDefs, [columnDefs]);
    const table = useReactTable({
        data: typeof data === 'undefined' ? [] : data.data,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        filterFns: { fuzzy: fuzzyFilter },
        pageCount: typeof data === 'undefined' ? 0 : data.last_page,
        rowCount: typeof data === 'undefined' ? 0 : data.total,
        state: {
            sorting,
            columnVisibility,
            pagination: {
                pageIndex: query.page - 1,
                pageSize: query.per_page,
            },
        },
        manualSorting: true,
        manualPagination: true,
        enableRowSelection: true,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        getRowId: (row) => row[rowId] as unknown as string,
        meta: {
            onEdit: (data: any) => {
                if (onEdit) onEdit(data);
            },
            onSelect: (row: any) => {
                if (onRowSelected) onRowSelected(row);
            },
            onChecked: (row: any, isChecked: boolean) => {
                if (isChecked) {
                    setSelectedRows([...selectedRows, row]);
                } else {
                    setSelectedRows(selectedRows.filter((item) => item[rowId] !== row[rowId]));
                }
            },
            onHeaderChecked: (isChecked: boolean) => {
                if (!data) return;

                if (isChecked) {
                    const ids = selectedRows.map((item) => item[rowId]);
                    setSelectedRows([...selectedRows, ...(data ? data.data.filter((item) => !ids.includes(item[rowId])) : [])]);
                } else {
                    const ids = data.data.map((item) => item[rowId]);
                    setSelectedRows(selectedRows.filter((item) => !ids.includes(item[rowId])));
                }
            },
        },
    });

    /*** imperative ***/
    useImperativeHandle(ref, () => ({
        refresh: () => handleRefreshData(),
        resetFilters: () => handleResetFilters(),
        clearSelectedRows: () => handleClearSelectedRows(),
    }));

    /*** effect ***/
    useEffect(() => {
        const columnsVisibilities = {};

        table.getAllColumns().forEach((column, index) => {
            if (typeof column.columnDef.meta?.columnDisplay !== 'undefined') {
                Object.assign(columnsVisibilities, { [column.id]: column.columnDef.meta?.columnDisplay });
            }

            if (column.id !== 'checkbox' && index === 0) {
                Object.assign(columnsVisibilities, { [column.id]: false });
            }
        });

        setColumnVisibility(columnsVisibilities);
    }, []);

    useEffect(() => {
        if (sorting.length > 0) {
            setQuery({ ...query, ...{ page: 1, sort: { field: sorting[0].id, direction: sorting[0].desc ? 'desc' : 'asc' } } });
        }

        if (sorting.length === 0) {
            setQuery({ ...query, ...{ page: 1, sort: { field: 'id', direction: 'asc' } } });
        }
    }, [sorting]);

    useEffect(() => {
        if (!firstPage) {
            setIsLoading(true);
            retriveData();
        } else {
            setFirstPage(false);
        }
    }, [query]);

    /*** events ***/
    const retriveData = async (): Promise<void> => {
        const response = await axios.get(url, {
            params: {
                ...query,
                ...additionalQueryStrings,
                ...{ sort: `${query.sort.field}.${query.sort.direction}`, search: search },
            },
        });

        if (![HttpStatusCode.Ok].includes(response.status)) {
            setIsLoading(false);
            setData(undefined);
            return;
        }

        const data = response.data;

        setData(data);

        setIsLoading(false);
    };

    const handleChangePerPage = (value: number) => {
        setQuery({
            ...query,
            ...{ per_page: value, page: 1 },
        });
    };

    const handleRefreshData = (): void => {
        setIsLoading(true);
        retriveData();
    };

    const handleResetFilters = (): void => {
        setSearch(undefined);
        setSorting([]);
        setQuery({ ...query, ...{ page: 1, sort: { field: 'id', direction: 'asc' } } });
    };

    const debounceSearch = debounce((value: string | undefined) => {
        setQuery({ ...query, ...{ page: 1, search: value } });
    }, 500);

    const executeSearch = useCallback((value: string | undefined) => debounceSearch(value), []);

    const handleSearch = (value: string) => {
        setSearch(value || undefined);
        executeSearch(value || undefined);
    };

    const handleClearSelectedRows = () => {
        table.resetRowSelection();
        setSelectedRows([]);
    };

    const handleNavigatePaging = (pageNumber: number) => {
        setQuery({
            ...query,
            ...{ page: pageNumber },
        });
    };

    const handleRowsSelected = () => {
        if (selectedRows.length <= 0) return;
        if (onRowsSelected) onRowsSelected(selectedRows);
    };

    const handleDelete = () => {
        if (selectedRows.length <= 0) return;
        if (onDeleteClicked) onDeleteClicked(selectedRows);
    };

    /*** components ***/
    return (
        <div className="w-full">
            {/* Data Per Page, Search, Refresh */}
            <div className="flex items-center justify-between py-2">
                <div className="flex space-x-2">
                    <Select value={String(query.per_page)} onValueChange={(value) => handleChangePerPage(Number(value))}>
                        <SelectTrigger className="w-auto">
                            <SelectValue placeholder="Pilih" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {dataPerPage.map((item) => (
                                    <SelectItem value={String(item)} key={String(item)} className="p-2 px-1.5">
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {selectedRows.length > 0 && props.access.permissions.delete && (
                        <Button type="button" variant="destructive" onClick={handleDelete}>
                            <TrashIcon className="size-4" />
                            <Label className="hidden md:flex">Delete</Label>
                        </Button>
                    )}
                    {selectedRows.length > 0 && onRowsSelected && (
                        <Button type="button" variant="outline" onClick={handleRowsSelected}>
                            <EllipsisVerticalIcon className="size-4" />
                            <Label className="hidden md:flex">More Actions</Label>
                        </Button>
                    )}
                </div>
                <div className="ml-2 flex space-x-2 lg:ml-0">
                    {useShowHideColumn && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-label="Toggle columns" variant="outline" size="icon" className="ml-auto hidden lg:flex">
                                    <EyeIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-auto">
                                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {table
                                    .getAllColumns()
                                    .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            >
                                                <span className="truncate">{column.columnDef.meta?.columnDisplayName}</span>
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    <div className="flex-1 sm:flex-initial md:ml-auto">
                        <div className="relative">
                            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="pl-8"
                                value={search ?? ''}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <Button type="button" variant="outline" size="icon" onClick={() => handleRefreshData()}>
                        <RotateCwIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className={cn('w-full', containerClass)}>
                <div data-slot="table-container" className="w-full overflow-x-auto overflow-y-hidden">
                    <ScrollArea className={cn('w-fit scroll-auto md:w-full', scrollAreaClass)}>
                        <Table>
                            <TableHeader className="sticky top-0 z-10 table-fixed shadow-sm backdrop-blur-sm">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="cursor-default hover:bg-transparent">
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} className={header.column.columnDef.meta?.headerClassName}>
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length}>
                                            <div className="h-full">
                                                <Spinner />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    table.getRowModel().rows?.length > 0 &&
                                    !isLoading &&
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && 'selected'}
                                            onDoubleClick={() =>
                                                table._getColumnDefs()[0].id !== 'checkbox' && onRowSelected && onRowSelected(row.original as any)
                                            }
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className={cell.column.columnDef.meta?.cellClassName}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                                {!isLoading && table.getRowModel().rows?.length <= 0 && (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No matching records found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
            </div>

            {/* Paging */}
            <div className="flex items-center justify-end space-x-2 pt-2">
                <div className="text-muted-foreground hidden flex-1 text-sm md:flex">
                    {table.getFilteredSelectedRowModel().rows.length <= 0
                        ? `Page ${query.page} of ${table.getPageCount()} (${numbro(table.getRowCount()).format({ thousandSeparated: true })} entries)`
                        : `${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} row(s) selected`}
                </div>
                <div className="text-muted-foreground flex-1 text-sm md:hidden">
                    {table.getFilteredSelectedRowModel().rows.length <= 0
                        ? `${query.page} / ${table.getPageCount()}`
                        : `${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} row(s) selected`}
                </div>
                <div className="space-x-2">
                    {data && (
                        <PaginationButtonsAjax
                            pagingType={pagingType}
                            currentPage={data.current_page}
                            lastPage={data.last_page}
                            links={data.links}
                            canGoToPreviousePage={table.getCanPreviousPage()}
                            canGoToNextPage={table.getCanNextPage()}
                            onNavigateClick={handleNavigatePaging}
                            useFirstAndLastPage={useFirstAndLastPage}
                        />
                    )}
                </div>
            </div>

            {/* Footer */}
            {onCancel && (
                <div className="flex grow-1 justify-between pt-2">
                    <Button variant="outline" onClick={() => onCancel && onCancel()}>
                        <XIcon /> Cancel
                    </Button>
                    {table._getColumnDefs()[0].id === 'checkbox' && (
                        <div className="flex space-x-2">
                            <Button type="button" variant={'secondary'} onClick={handleClearSelectedRows}>
                                <MousePointerClickIcon /> Clear
                            </Button>
                            <Button type="button" onClick={handleRowsSelected}>
                                <MousePointer2Icon /> Select
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default forwardRef<DataTablePaginationAjaxRef, DataTablePaginationAjaxProps<any, any>>(DataTablePaginationAjax);
