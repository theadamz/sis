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
import { type InspectionFormDT, type SharedData } from '@/types';
import { getInspectionStage } from '@/types/enum';
import { usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVerticalIcon, PencilIcon } from 'lucide-react';

export const InspectionFormColumns: ColumnDef<InspectionFormDT, unknown>[] = [
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
        accessorKey: 'flow',
        meta: {
            columnDisplayName: 'Flow',
            headerClassName: 'w-[80px]',
        },
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Flow
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
    },
    {
        accessorKey: 'inspection_type_name',
        meta: {
            columnDisplayName: 'Inspection Type',
        },
        header: ({ column }) => {
            return <Label>Inspection Type</Label>;
        },
    },
    {
        accessorKey: 'code',
        meta: {
            columnDisplayName: 'Code',
            headerClassName: 'w-[250px]',
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
        accessorKey: 'required_stages',
        meta: {
            columnDisplay: true, // hide column after init
        },
        header: () => <Label>Stages</Label>,
        cell: ({ row }) => {
            const stages = JSON.parse(row.getValue('required_stages')) as string[];

            return stages.map((stage) => (
                <Badge key={stage} variant={getInspectionStage(stage, 'variant') as any} className="me-1">
                    {getInspectionStage(stage, 'label')}
                </Badge>
            ));
        },
    },
    {
        accessorKey: 'use_eta_dest',
        meta: {
            headerClassName: 'w-[40px] text-center',
            columnDisplayName: 'ETA Dest.', // Column display name
            columnDisplay: true, // hide column after init
        },
        header: () => <Label>ETA Dest.</Label>,
        cell: ({ row }) => (
            <div className="flex w-full justify-center">
                <Badge variant={'outline'}>{row.getValue('use_eta_dest') ? 'Yes' : 'No'}</Badge>
            </div>
        ),
    },
    {
        accessorKey: 'use_ata_dest',
        enableResizing: true,
        meta: {
            headerClassName: 'w-[40px] text-center',
            columnDisplayName: 'ATA Dest.', // Column display name
            columnDisplay: true, // hide column after init
        },
        header: () => <Label>ATA Dest.</Label>,
        cell: ({ row }) => (
            <div className="flex w-full justify-center">
                <Badge variant={'outline'}>{row.getValue('use_ata_dest') ? 'Yes' : 'No'}</Badge>
            </div>
        ),
    },
    {
        accessorKey: 'inspection_form_sections_count',
        enableResizing: true,
        meta: {
            headerClassName: 'w-[40px] text-center',
            columnDisplayName: 'Sections', // Column display name
            columnDisplay: true, // hide column after init
        },
        header: () => <Label>Sections</Label>,
        cell: ({ row }) => <Label className="flex justify-center">{row.getValue('inspection_form_sections_count')}</Label>,
    },
    {
        accessorKey: 'inspection_form_items_count',
        enableResizing: true,
        meta: {
            headerClassName: 'w-[40px] text-center',
            columnDisplayName: 'Items', // Column display name
            columnDisplay: true, // hide column after init
        },
        header: () => <Label>Items</Label>,
        cell: ({ row }) => <Label className="flex justify-center">{row.getValue('inspection_form_items_count')}</Label>,
    },
    {
        accessorKey: 'is_publish',
        enableResizing: true,
        meta: {
            headerClassName: 'w-[40px] text-center',
            columnDisplayName: 'Publish', // Column display name
            columnDisplay: true, // hide column after init
        },
        header: () => {
            return <Label>Publish</Label>;
        },
        cell: ({ row }) => <Badge variant={row.getValue('is_publish') ? 'outline' : 'warning'}>{row.getValue('is_publish') ? 'Yes' : 'No'}</Badge>,
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
