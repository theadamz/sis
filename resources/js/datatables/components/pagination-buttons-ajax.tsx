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
import { type Link } from '@/types/datatables';
import { JSX } from 'react';

type PaginationButtonsAjaxProps = {
    pagingType: 'simple' | 'paging';
    currentPage: number;
    lastPage: number;
    links: Link[];
    canGoToPreviousePage: boolean;
    canGoToNextPage: boolean;
    leftSidePageCount?: number;
    rightSidePageCount?: number;
    useFirstAndLastPage?: boolean;
    onNavigateClick: (page: number) => void;
};

const defaultLeftSideCount = 3;
const defaultRightSideCount = 2;

export default function PaginationButtonsAjax({
    pagingType,
    currentPage,
    lastPage,
    links,
    canGoToPreviousePage,
    canGoToNextPage,
    leftSidePageCount = defaultLeftSideCount,
    rightSidePageCount = defaultRightSideCount,
    useFirstAndLastPage = false,
    onNavigateClick,
}: Readonly<PaginationButtonsAjaxProps>): JSX.Element {
    if (pagingType === 'paging') {
        return (
            <Pagination>
                <PaginationContent>
                    {/* First page */}
                    {canGoToPreviousePage && currentPage !== 1 && (
                        <PaginationItem className="cursor-default">
                            <PaginationFirst onClick={() => onNavigateClick(1)} />
                        </PaginationItem>
                    )}

                    {links.map((item, index) => {
                        // previous page
                        if (canGoToPreviousePage && currentPage > 1 && index === 0) {
                            return (
                                <PaginationItem key={item.label} className="cursor-default">
                                    <PaginationPrevious onClick={() => onNavigateClick(currentPage - 1)} />
                                </PaginationItem>
                            );
                        }

                        // next page
                        if (canGoToNextPage && currentPage !== lastPage && index === links.length - 1) {
                            return (
                                <PaginationItem key={item.label} className="cursor-default">
                                    <PaginationNext onClick={() => onNavigateClick(currentPage + 1)} />
                                </PaginationItem>
                            );
                        }

                        if (item.label === '...') {
                            return (
                                <PaginationItem key={`${item.label}_${String(index)}`} className="cursor-default">
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        }

                        if (item.active) {
                            return (
                                <PaginationItem key={item.label} className="cursor-default">
                                    <PaginationLink isActive={item.active}>{item.label}</PaginationLink>
                                </PaginationItem>
                            );
                        }

                        if (
                            (index < leftSidePageCount + 1 || links.length - index <= rightSidePageCount + 1) &&
                            index !== 0 &&
                            index !== links.length - 1
                        ) {
                            return (
                                <PaginationItem key={item.label} className="cursor-default">
                                    <PaginationLink isActive={item.active} onClick={() => onNavigateClick(Number(item.label))}>
                                        {item.label}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        }
                    })}

                    {/* last page */}
                    {useFirstAndLastPage && currentPage !== lastPage && (
                        <PaginationItem className="cursor-default">
                            <PaginationLast onClick={() => onNavigateClick(lastPage)} />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        );
    } else {
        return (
            <Pagination>
                <PaginationContent>
                    {canGoToPreviousePage && useFirstAndLastPage && currentPage !== 1 && (
                        <PaginationItem className="cursor-default">
                            <PaginationFirst onClick={() => onNavigateClick(1)} />
                        </PaginationItem>
                    )}
                    {canGoToPreviousePage && (
                        <PaginationItem className="cursor-default">
                            <PaginationPrevious onClick={() => onNavigateClick(currentPage - 1)} />
                        </PaginationItem>
                    )}
                    {canGoToNextPage && (
                        <PaginationItem className="cursor-default">
                            <PaginationNext onClick={() => onNavigateClick(currentPage + 1)} />
                        </PaginationItem>
                    )}
                    {canGoToNextPage && useFirstAndLastPage && currentPage !== lastPage && (
                        <PaginationItem className="cursor-default">
                            <PaginationLast onClick={() => onNavigateClick(lastPage)} />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        );
    }
}
