'use client';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@shared/components/ui/pagination';

const ITEMS_PER_PAGE = 10;

interface CyclesPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    onPageChange: (page: number) => void;
}

export function CyclesPagination({
    currentPage,
    totalPages,
    totalItems,
    limit,
    onPageChange,
}: CyclesPaginationProps) {
    const from = (currentPage - 1) * limit + 1;
    const to = Math.min(currentPage * limit, totalItems);

    function getVisiblePages(): (number | 'ellipsis')[] {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | 'ellipsis')[] = [1];

        if (currentPage > 3) {
            pages.push('ellipsis');
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push('ellipsis');
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    }

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-medium text-foreground">{from}</span> to{' '}
                <span className="font-medium text-foreground">{to}</span> of{' '}
                <span className="font-medium text-foreground">
                    {totalItems}
                </span>{' '}
                cycles
            </p>
            <Pagination className="mx-0 w-auto">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1)
                                    onPageChange(currentPage - 1);
                            }}
                            className={
                                currentPage <= 1
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                            }
                        />
                    </PaginationItem>

                    {getVisiblePages().map((page, index) =>
                        page === 'ellipsis' ? (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href="#"
                                    isActive={page === currentPage}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(page);
                                    }}
                                    className="cursor-pointer"
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ),
                    )}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages)
                                    onPageChange(currentPage + 1);
                            }}
                            className={
                                currentPage >= totalPages
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
