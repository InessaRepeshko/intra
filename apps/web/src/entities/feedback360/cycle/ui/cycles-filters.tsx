'use client';

import { format } from 'date-fns';
import { CalendarIcon, RotateCcw, Search } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { CycleStage } from '@entities/feedback360/cycle/model/types';
import { Button } from '@shared/components/ui/button';
import { Calendar } from '@shared/components/ui/calendar';
import { Input } from '@shared/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@shared/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@shared/components/ui/select';
import { cn } from '@shared/lib/utils/cn';

interface CyclesFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    stage: string;
    onStageChange: (value: string) => void;
    dateRange: DateRange | undefined;
    onDateRangeChange: (range: DateRange | undefined) => void;
    reviewCount: string;
    onReviewCountChange: (value: string) => void;
    onReset: () => void;
}

const stageOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: CycleStage.NEW, label: 'New' },
    { value: CycleStage.ACTIVE, label: 'Active' },
    { value: CycleStage.FINISHED, label: 'Finished' },
    { value: CycleStage.ARCHIVED, label: 'Archived' },
    { value: CycleStage.CANCELED, label: 'Canceled' },
];

const reviewCountOptions = [
    { value: 'ALL', label: 'All Reviews' },
    { value: '0', label: 'No reviews' },
    { value: '1-10', label: '1-10 reviews' },
    { value: '11-50', label: '11-50 reviews' },
    { value: '50+', label: '50+ reviews' },
];

export function CyclesFilters({
    search,
    onSearchChange,
    stage,
    onStageChange,
    dateRange,
    onDateRangeChange,
    reviewCount,
    onReviewCountChange,
    onReset,
}: CyclesFiltersProps) {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1 lg:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search by title or description..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9"
                />
            </div>

            <Select value={stage} onValueChange={onStageChange}>
                <SelectTrigger className="w-full lg:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    {stageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={reviewCount} onValueChange={onReviewCountChange}>
                <SelectTrigger className="w-full lg:w-[180px]">
                    <SelectValue placeholder="Filter by reviews" />
                </SelectTrigger>
                <SelectContent>
                    {reviewCountOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'w-full justify-start text-left font-normal lg:w-[280px]',
                            !dateRange && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, 'MMM dd, yyyy')} -{' '}
                                    {format(dateRange.to, 'MMM dd, yyyy')}
                                </>
                            ) : (
                                format(dateRange.from, 'MMM dd, yyyy')
                            )
                        ) : (
                            <span>Filter by date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={onDateRangeChange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>

            <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-muted-foreground hover:text-foreground"
            >
                <RotateCcw className="mr-1 h-4 w-4" />
                Reset
            </Button>
        </div>
    );
}
