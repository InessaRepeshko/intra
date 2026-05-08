'use client';

import { Award, Search } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { cn } from '@shared/lib/utils/cn';
import { DateRangePicker } from '@shared/ui/date-range-picker';
import { MultiSelect } from '@shared/ui/multi-select';
import { RotateCcw } from 'lucide-react';

interface CompetenceFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    dateRange: DateRange | undefined;
    onDateRangeChange: (range: DateRange | undefined) => void;
    positions: string[];
    onPositionsChange: (value: string[]) => void;
    positionOptions: { id: string | number; title: string }[];
    onReset: () => void;
}

export function CompetenceFilters({
    search,
    onSearchChange,
    dateRange,
    onDateRangeChange,
    positions,
    onPositionsChange,
    positionOptions,
    onReset,
}: CompetenceFiltersProps) {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-start flex-wrap">
            <div className="relative w-full flex-1 md:min-w-[300px] lg:max-w-sm">
                <Search
                    className={cn(
                        'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2',
                        !search ? 'text-muted-foreground' : 'text-foreground',
                    )}
                />
                <Input
                    placeholder="Search by competence code, title or description..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 truncate text-sm"
                />
            </div>

            <MultiSelect
                options={positionOptions.map((opt) => ({
                    label: opt.title,
                    value: String(opt.id),
                }))}
                value={positions}
                onValueChange={onPositionsChange}
                placeholder="All Positions"
                emptyText="No positions found"
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<Award className="h-4 w-4" />}
            />

            <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={onDateRangeChange}
            />

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
