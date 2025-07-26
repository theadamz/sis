import { RankingInfo } from '@tanstack/match-sorter-utils';
import { FilterFn, RowData } from '@tanstack/react-table';
import { Inspection, InspectionForm, Role, Site, TransactionType, UserDataTable, VehicleType } from '.';

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface TableMeta<TData extends RowData> {
        onEdit?: (row: any) => void;
        onSelect?: (row: any) => void;
        onChecked?: (row: any, isChecked: boolean) => void;
        onHeaderChecked?: (isChecked: boolean) => void;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        headerClassName?: string;
        cellClassName?: string;
        columnDisplayName?: string;
        columnDisplay?: boolean;
    }

    interface FilterFns {
        fuzzy?: FilterFn<unknown>;
    }

    interface FilterMeta {
        itemRank: RankingInfo;
    }
}

export type Link = {
    active: boolean;
    label: string;
    url: string | null;
};

export interface IDataTablePagination<TData> {
    current_page: number;
    data: TData[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string | null;
    links: Link[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

/*** App ***/
export interface IRoleDataTablePagination extends Omit<IDataTablePagination<Role>, 'data'> {
    data: Role[];
}

export interface ISiteDataTablePagination extends Omit<IDataTablePagination<Site>, 'data'> {
    data: Site[];
}

export interface IUserDataTablePagination extends Omit<IDataTablePagination<UserDataTable>, 'data'> {
    data: UserDataTable[];
}

export interface ITransactionTypeDataTablePagination extends Omit<IDataTablePagination<TransactionType>, 'data'> {
    data: TransactionType[];
}

/*** Basic ***/
export interface IVehicleTypeDataTablePagination extends Omit<IDataTablePagination<VehicleType>, 'data'> {
    data: VehicleType[];
}

/*** Inspection ***/
export interface IInspectionFormDataTablePagination extends Omit<IDataTablePagination<InspectionForm>, 'data'> {
    data: InspectionForm[];
}

export interface IInspectionDataTablePagination extends Omit<IDataTablePagination<InspectionForm>, 'data'> {
    data: Inspection[];
}
