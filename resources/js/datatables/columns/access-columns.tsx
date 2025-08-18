import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CaretColumn from '@/datatables/components/caret-column';
import { fuzzySort, sortHandler } from '@/lib/utils';
import { type SharedData, type UserAccess } from '@/types';
import { usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVerticalIcon, PencilIcon } from 'lucide-react';

type Permisisons = { [key: string]: boolean };

export const AccessColumns: ColumnDef<UserAccess, unknown>[] = [
    {
        id: 'select',
        meta: {
            headerClassName: 'w-[40px]', // fixed width
        },
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        enableResizing: true,
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Access Name
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        meta: {
            columnDisplayName: 'Access Name', // Column display name
        },
    },
    {
        accessorKey: 'permissions',
        enableResizing: true,
        header: 'Permissions',
        cell: ({ row }) => {
            const permissions: Permisisons = row.getValue('permissions');
            return (
                <div className="space-x-2">
                    {Object.entries(permissions).map(([permisison, isAllowed]) => {
                        return (
                            <Badge key={permisison} variant={isAllowed ? 'outline' : 'destructive'}>
                                {permisison}
                            </Badge>
                        );
                    })}
                </div>
            );
        },
        meta: {
            columnDisplayName: 'Permissions', // Column display name
            columnDisplay: true, // hide column after init
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        meta: {
            headerClassName: 'w-[40px]', // fixed width
        },
        cell: ({ row, table }) => {
            const permissions = usePage<SharedData>().props.access.permissions;
            const item = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open actions</span>
                            <EllipsisVerticalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {permissions.edit && (
                            <DropdownMenuItem onClick={() => table.options.meta?.onEdit && table.options.meta.onEdit(item as any)}>
                                <PencilIcon className="mr-2" /> Edit
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
