import { Button } from '@/components//ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import CaretColumn from '@/datatables/components/caret-column';
import { sortHandler } from '@/lib/utils';
import { type Gate, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVerticalIcon, PencilIcon } from 'lucide-react';

export const GateColumns: ColumnDef<Gate, unknown>[] = [
    {
        id: 'checkbox',
        meta: {
            headerClassName: 'w-[40px]', // fixed width
        },
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => {
                    table.toggleAllPageRowsSelected(!!value);

                    if (table.options.meta?.onHeaderChecked) table.options.meta.onHeaderChecked(!!value);
                }}
                aria-label="Select all"
            />
        ),
        cell: ({ row, table }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => {
                    row.toggleSelected(!!value);

                    if (table.options.meta?.onChecked) table.options.meta.onChecked(row.original, !!value);
                }}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'site_name',
        meta: {
            columnDisplayName: 'Site',
        },
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Site
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
    },
    {
        accessorKey: 'code',
        meta: {
            columnDisplayName: 'Code',
        },
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Code
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
    },
    {
        accessorKey: 'name',
        meta: {
            columnDisplayName: 'Name',
        },
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Name
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
    },
    {
        accessorKey: 'is_active',
        enableResizing: true,
        meta: {
            headerClassName: 'w-[40px] text-center',
            columnDisplayName: 'Active', // Column display name
            columnDisplay: true, // hide column after init
        },
        header: () => {
            return <Label>Active</Label>;
        },
        cell: ({ row }) => <Badge variant={row.getValue('is_active') ? 'outline' : 'warning'}>{row.getValue('is_active') ? 'Yes' : 'No'}</Badge>,
    },
    {
        id: 'actions',
        enableHiding: false,
        meta: {
            headerClassName: 'w-[40px]', // fixed width
        },
        cell: ({ row, table }) => {
            const { permissions } = usePage<SharedData>().props.access;
            const item = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" variant="ghost" className="size-8 p-0">
                            <span className="sr-only">Open actions</span>
                            <EllipsisVerticalIcon className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {permissions.edit && (
                            <DropdownMenuItem onClick={() => table.options.meta?.onEdit && table.options.meta.onEdit(item as any)}>
                                <PencilIcon /> Edit
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
