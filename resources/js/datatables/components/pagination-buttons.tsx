import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationFirst,
    PaginationItem,
    PaginationLast,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { IDataTablePagination as IPagination } from '@/types/datatables';
import { Link } from '@inertiajs/react';
import { JSX } from 'react';

type PaginationButtonsProps<TData> = {
    pagingType: 'simple' | 'paging';
    page: IPagination<TData>;
    useFirstPage?: boolean;
    useLastPage?: boolean;
    leftSidePageCount?: number;
    rightSidePageCount?: number;
    useFirstLastPage?: boolean;
};

const defaultLeftSideCount = 3;
const defaultRightSideCount = 2;

export default function PaginationButtons<TData>({
    pagingType,
    page,
    useFirstPage = true,
    useLastPage = true,
    leftSidePageCount = defaultLeftSideCount,
    rightSidePageCount = defaultRightSideCount,
    useFirstLastPage = false,
}: Readonly<PaginationButtonsProps<TData>>): JSX.Element {
    // if todal <= 0 then return noting
    if (page.total <= 0) return <></>;

    if (pagingType === 'paging') {
        return (
            <Pagination>
                <PaginationContent>
                    {/* First page */}
                    {useFirstPage && page.first_page_url && page.current_page !== 1 && useFirstLastPage && (
                        <Link href={page.first_page_url} as="button" replace preserveState>
                            <PaginationItem>
                                <PaginationFirst />
                            </PaginationItem>
                        </Link>
                    )}
                    {page.links.map((item, index) => {
                        const url = item.url ? item.url : '#';

                        // previous page
                        if (page.total > 1 && page.current_page > 1 && index === 0) {
                            return (
                                item.url && (
                                    <Link href={url} key={item.label} as="button" replace preserveState>
                                        <PaginationItem>
                                            <PaginationPrevious isActive={item.active} />
                                        </PaginationItem>
                                    </Link>
                                )
                            );
                        }

                        // next page
                        if (index === page.links.length - 1 && page.current_page !== page.last_page) {
                            return (
                                item.url && (
                                    <Link href={url} key={item.label} as="button" replace preserveState>
                                        <PaginationItem>
                                            <PaginationNext isActive={item.active} />
                                        </PaginationItem>
                                    </Link>
                                )
                            );
                        }

                        // number page
                        if (index > 0) {
                            if (item.label === '...') {
                                return (
                                    <PaginationItem key={`${item.label}_${String(index)}`}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }

                            if (item.active) {
                                return (
                                    <PaginationItem key={item.label}>
                                        <PaginationLink isActive={item.active}>{item.label}</PaginationLink>
                                    </PaginationItem>
                                );
                            }

                            return (
                                (index < leftSidePageCount + 1 || page.links.length - index <= rightSidePageCount + 1) &&
                                item.url && (
                                    <Link href={url} key={item.label} as="button" replace preserveState>
                                        <PaginationItem>
                                            <PaginationLink isActive={item.active}>{item.label}</PaginationLink>
                                        </PaginationItem>
                                    </Link>
                                )
                            );
                        }
                    })}

                    {/* last page */}
                    {useLastPage && page.last_page_url && page.current_page !== page.last_page && useFirstLastPage && (
                        <Link href={page.last_page_url} as="button" replace preserveState>
                            <PaginationItem>
                                <PaginationLast />
                            </PaginationItem>
                        </Link>
                    )}
                </PaginationContent>
            </Pagination>
        );
    } else {
        return (
            <Pagination>
                <PaginationContent>
                    {page.first_page_url && page.current_page !== 1 && (
                        <Link href={page.first_page_url} as="button" replace preserveState>
                            <PaginationItem>
                                <PaginationFirst />
                            </PaginationItem>
                        </Link>
                    )}
                    {page.prev_page_url && (
                        <Link href={page.prev_page_url} as="button" replace preserveState>
                            <PaginationItem>
                                <PaginationPrevious />
                            </PaginationItem>
                        </Link>
                    )}
                    {page.next_page_url && (
                        <Link href={page.next_page_url} as="button" replace preserveState>
                            <PaginationItem>
                                <PaginationNext />
                            </PaginationItem>
                        </Link>
                    )}
                    {page.last_page_url && page.current_page !== page.last_page && (
                        <Link href={page.last_page_url} as="button" replace preserveState>
                            <PaginationItem>
                                <PaginationLast />
                            </PaginationItem>
                        </Link>
                    )}
                </PaginationContent>
            </Pagination>
        );
    }
}
