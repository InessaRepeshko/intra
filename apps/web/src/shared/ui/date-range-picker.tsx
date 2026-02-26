'use client';

import { format } from 'date-fns';
import { CalendarIcon, XIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@shared/components/ui/button';
import { Calendar } from '@shared/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@shared/components/ui/popover';
import { cn } from '@shared/lib/utils/cn';

interface DateRangePickerProps {
    dateRange: DateRange | undefined;
    onDateRangeChange: (range: DateRange | undefined) => void;
    className?: string;
    placeholder?: string;
}

export function DateRangePicker({
    dateRange,
    onDateRangeChange,
    className,
    placeholder = 'Filter by date range',
}: DateRangePickerProps) {
    return (
        <div className={cn('relative w-full lg:w-[280px]', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'w-full justify-start text-left font-normal pr-8',
                            !dateRange ? 'text-muted-foreground' : 'text-foreground',
                        )}
                    >
                        <div className="flex flex-1 items-center overflow-hidden">
                            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                            <span className="truncate">
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(
                                                dateRange.from,
                                                'MMM dd, yyyy',
                                            )}{' '}
                                            -{' '}
                                            {format(
                                                dateRange.to,
                                                'MMM dd, yyyy',
                                            )}
                                        </>
                                    ) : (
                                        format(dateRange.from, 'MMM dd, yyyy')
                                    )
                                ) : (
                                    placeholder
                                )}
                            </span>
                        </div>
                    </Button>
                </PopoverTrigger>

                {dateRange?.from && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDateRangeChange(undefined);
                        }}
                    >
                        <XIcon className="h-4 w-4" />
                        <span className="sr-only">Clear date range</span>
                    </Button>
                )}

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
        </div>
    );
}
