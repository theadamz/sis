import { Button } from '@/components//ui/button';
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
import type { RegisteredVehicleDT, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { CopyIcon, EllipsisVerticalIcon, PencilIcon } from 'lucide-react';

export const RegisteredVehicleColumns: ColumnDef<RegisteredVehicleDT, unknown>[] = [
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
        accessorKey: 'ownership',
        meta: {
            columnDisplayName: 'Ownership',
            headerClassName: 'w-[250px]',
        },
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Ownership
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
    },
    {
        accessorKey: 'reg_no',
        meta: {
            columnDisplayName: 'Reg. No.',
        },
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Reg. No.
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
    },
    {
        accessorKey: 'brand',
        meta: {
            columnDisplayName: 'Brand',
        },
        header: () => <Label>Brand</Label>,
        cell: ({ row }) => <Label>{row.getValue('brand')}</Label>,
    },
    {
        accessorKey: 'type',
        meta: {
            columnDisplayName: 'Type',
        },
        header: () => <Label>Type</Label>,
        cell: ({ row }) => <Label>{row.getValue('type')}</Label>,
    },
    {
        accessorKey: 'category',
        meta: {
            columnDisplayName: 'Category',
        },
        header: () => <Label>Category</Label>,
        cell: ({ row }) => <Label>{row.getValue('category')}</Label>,
    },
    {
        accessorKey: 'model',
        meta: {
            columnDisplayName: 'Model',
        },
        header: () => <Label>Model</Label>,
        cell: ({ row }) => <Label>{row.getValue('model')}</Label>,
    },
    {
        accessorKey: 'chassis_no',
        meta: {
            columnDisplayName: 'Chassis No.',
        },
        header: () => <Label>Chassis No.</Label>,
        cell: ({ row }) => <Label>{row.getValue('chassis_no')}</Label>,
    },
    {
        accessorKey: 'engine_no',
        meta: {
            columnDisplayName: 'Engine No.',
        },
        header: () => <Label>Engine No.</Label>,
        cell: ({ row }) => <Label>{row.getValue('engine_no')}</Label>,
    },
    {
        accessorKey: 'color',
        meta: {
            columnDisplayName: 'Color',
        },
        header: () => <Label>Color</Label>,
        cell: ({ row }) => <Label>{row.getValue('color')}</Label>,
    },
    {
        accessorKey: 'registered_for',
        meta: {
            columnDisplayName: 'Registered For',
        },
        header: () => <Label>Registered For</Label>,
        cell: ({ row }) => <Label>{row.getValue('registered_for')}</Label>,
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
                        {permissions.create && (
                            <DropdownMenuItem
                                onClick={() => table.options.meta?.onCustomEvent && table.options.meta.onCustomEvent(item as any, 'duplicate')}
                            >
                                <CopyIcon /> Dulicate
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
