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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn, fuzzyFilter } from '@/lib/utils';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, EyeIcon, Search, TrashIcon } from 'lucide-react';
import numbro from 'numbro';
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';

export interface DataTableRef {
    resetFilters: () => void;
    clearSelectedRows: () => void;
}

type DataTableProps<TData, TValue> = {
    columnDefs: ColumnDef<TData, TValue>[];
    data: TData[];
    containerClass?: string;
    scrollAreaClass?: string;
    useShowHideColumn?: boolean;
    onEdit?: (data: any) => void;
    onDelete?: (data: any[]) => void;
};

const dataPerPage: Array<number | string> = [10, 25, 50, 100, 'All'];

const DataTablePaginationClient = <TData, TValue>(
    { columnDefs, data = [], containerClass, scrollAreaClass, useShowHideColumn = true, onEdit, onDelete }: DataTableProps<TData, TValue>,
    ref: ForwardedRef<DataTableRef>,
) => {
    /*** inertia js ***/
    const props = usePage<SharedData>().props;

    /*** componenet state ***/
    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: 50, //default page size
    });
    const [globalFilter, setGlobalFilter] = useState('');

    /*** tanstack table ***/
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const columns = useMemo(() => columnDefs, []);
    const table = useReactTable({
        data: data,
        columns: columns,
        filterFns: {
            fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'fuzzy',
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(), //client side filtering
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onColumnVisibilityChange: setColumnVisibility,
        meta: {
            onEdit: (data: any) => onEdit && onEdit(data),
        },
        state: {
            sorting,
            columnVisibility,
            pagination,
            globalFilter,
        },
    });

    /*** imperative ***/
    useImperativeHandle(ref, () => ({
        resetFilters: () => handleResetFilters(),
        clearSelectedRows: () => handleClearSelectedRows(),
    }));

    /*** effect ***/
    useEffect(() => {
        let columnsVisibilities = {};
        table
            .getAllColumns()
            .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
            .forEach((column) => {
                if (typeof column.columnDef.meta?.columnDisplay !== undefined) {
                    Object.assign(columnsVisibilities, { [column.id]: column.columnDef.meta?.columnDisplay });
                }
            });

        setColumnVisibility(columnsVisibilities);
    }, []);

    /*** events ***/
    const handleResetFilters = (): void => {
        setSorting([]);
        setGlobalFilter('');
    };

    const handleDelete = () => {
        onDelete && onDelete(table.getFilteredSelectedRowModel().flatRows.map((item) => item.original));
    };

    const handleClearSelectedRows = () => {
        table.resetRowSelection();
    };

    /*** components ***/
    return (
        <div className="w-full">
            {/* Data Per Page, Search */}
            <div className="flex items-center justify-between py-2">
                <div className="flex space-x-2">
                    <Select
                        value={String(pagination.pageSize)}
                        onValueChange={(value) =>
                            setPagination({
                                ...pagination,
                                ...{ pageSize: Number(value) },
                            })
                        }
                    >
                        <SelectTrigger className="w-auto">
                            <SelectValue placeholder="Pilih" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {dataPerPage.map((item) => (
                                    <SelectItem value={String(item === 'All' ? -1 : item)} key={String(item)} className="p-2 px-1.5">
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {table.getFilteredSelectedRowModel().rows.length > 0 && props.access.permissions.delete && (
                        <Button type="button" variant="destructive" className="ml-2" onClick={handleDelete}>
                            <TrashIcon className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    )}
                </div>
                <div className="flex space-x-2">
                    {useShowHideColumn && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-label="Toggle columns" variant="outline" size="icon" className="ml-auto hidden lg:flex">
                                    <EyeIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
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
                    <div className="ml-auto flex-1 sm:flex-initial">
                        <div className="relative">
                            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="pl-8"
                                value={globalFilter ?? ''}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className={cn('w-full', containerClass)}>
                <ScrollArea className={cn(scrollAreaClass)}>
                    <Table>
                        <TableHeader className="sticky top-0 z-10 shadow-sm backdrop-blur-sm">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
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
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className={cell.column.columnDef.meta?.cellClassName}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
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

            {/* Paging */}
            <div className="flex items-center justify-end space-x-2 pt-2">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length <= 0
                        ? `Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount() < 0 ? 1 : table.getPageCount()} (${numbro(
                              table.getRowCount(),
                          ).format({
                              thousandSeparated: true,
                          })} entries)`
                        : `${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} row(s) selected`}
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="icon" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
                        <ChevronsLeftIcon className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        <ChevronLeftIcon className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        <ChevronRightIcon className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
                        <ChevronsRightIcon className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default forwardRef<DataTableRef, DataTableProps<any, any>>(DataTablePaginationClient);
