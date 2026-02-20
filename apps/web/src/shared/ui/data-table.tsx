'use client';

import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@shared/components/ui/table';
import { cn } from '@shared/lib/utils/cn';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Search,
} from 'lucide-react';
import { type ReactNode } from 'react';

export interface Column<T> {
    key: string;
    title: string;
    sortable?: boolean;
    className?: string;
    render: (item: T) => ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
    onSort?: (field: string) => void;
    page?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    total?: number;
    filters?: ReactNode;
    emptyMessage?: string;
}

export function DataTable<T>({
    columns,
    data,
    searchPlaceholder = 'Search...',
    searchValue,
    onSearchChange,
    sortBy,
    sortDirection,
    onSort,
    page = 1,
    totalPages = 1,
    onPageChange,
    total,
    filters,
    emptyMessage = 'No results found.',
}: DataTableProps<T>) {
    return (
        <div className="flex flex-col gap-4">
            {(onSearchChange || filters) && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {onSearchChange && (
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={searchPlaceholder}
                                value={searchValue || ''}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    )}
                    {filters && (
                        <div className="flex flex-wrap items-center gap-2">
                            {filters}
                        </div>
                    )}
                </div>
            )}

            <div className="rounded-lg border border-border bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            {columns.map((col) => (
                                <TableHead
                                    key={col.key}
                                    className={cn(
                                        'text-xs font-semibold uppercase tracking-wider text-muted-foreground',
                                        col.className,
                                    )}
                                >
                                    {col.sortable && onSort ? (
                                        <button
                                            onClick={() => onSort(col.key)}
                                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                                        >
                                            {col.title}
                                            {sortBy === col.key ? (
                                                sortDirection === 'ASC' ? (
                                                    <ArrowUp className="h-3 w-3" />
                                                ) : (
                                                    <ArrowDown className="h-3 w-3" />
                                                )
                                            ) : (
                                                <ArrowUpDown className="h-3 w-3 opacity-40" />
                                            )}
                                        </button>
                                    ) : (
                                        col.title
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-32 text-center text-muted-foreground"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, index) => (
                                <TableRow
                                    key={index}
                                    className="hover:bg-muted/30 transition-colors"
                                >
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.key}
                                            className={cn(
                                                'text-sm',
                                                col.className,
                                            )}
                                        >
                                            {col.render(item)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {(totalPages > 1 || total !== undefined) && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        {total !== undefined
                            ? `${total} total results`
                            : `Page ${page} of ${totalPages}`}
                    </span>
                    {totalPages > 1 && onPageChange && (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(page - 1)}
                                disabled={page <= 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Previous</span>
                            </Button>
                            <span className="text-sm font-medium">
                                {page} / {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(page + 1)}
                                disabled={page >= totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">Next</span>
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
