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
import type { SharedData, VehicleInspectionDT } from '@/types';
import { usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { CopyIcon, EllipsisVerticalIcon, PencilIcon } from 'lucide-react';

export const VehicleInspectionColumns: ColumnDef<VehicleInspectionDT, unknown>[] = [
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
        accessorKey: 'inspection_no',
        meta: {
            columnDisplayName: 'Inspection No.',
            headerClassName: 'w-[250px]',
        },
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Inspection No.
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
    },
    {
        accessorKey: 'inspection_date',
        meta: {
            columnDisplayName: 'Inspection Date',
        },
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Inspection Date
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
    },
    {
        accessorKey: 'status',
        enableResizing: true,
        meta: {
            headerClassName: 'w-[40px] text-center',
            columnDisplayName: 'Status', // Column display name
            columnDisplay: true, // hide column after init
        },
        header: () => <Label>Status</Label>,
        cell: ({ row }) => <Label className="flex justify-center">Checked In</Label>,
    },
    {
        accessorKey: 'Current Stage',
        enableResizing: true,
        meta: {
            headerClassName: 'w-[40px] text-center',
            columnDisplayName: 'Current Stage', // Column display name
            columnDisplay: true, // hide column after init
        },
        header: () => <Label>Current Stage</Label>,
        cell: ({ row }) => <Label className="flex justify-center">Checked In</Label>,
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
