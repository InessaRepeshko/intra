'use client';

import { RotateCcw, Search } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { CycleStage } from '@entities/feedback360/cycle/model/types';
import { stageConfig } from '@entities/feedback360/cycle/ui/stage-badge';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { DateRangePicker } from '@shared/ui/date-range-picker';
import { MultiSelect } from '@shared/ui/multi-select';

interface CyclesFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    stages: string[];
    onStagesChange: (value: string[]) => void;
    dateRange: DateRange | undefined;
    onDateRangeChange: (range: DateRange | undefined) => void;
    onReset: () => void;
}

const stageOptions = [
    { value: CycleStage.NEW, label: 'New' },
    { value: CycleStage.ACTIVE, label: 'Active' },
    { value: CycleStage.FINISHED, label: 'Finished' },
    { value: CycleStage.ARCHIVED, label: 'Archived' },
    { value: CycleStage.CANCELED, label: 'Canceled' },
];

export function CyclesFilters({
    search,
    onSearchChange,
    stages,
    onStagesChange,
    dateRange,
    onDateRangeChange,
    onReset,
}: CyclesFiltersProps) {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center flex-wrap">
            <div className="relative flex-1 lg:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search by title or description..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9"
                />
            </div>

            <MultiSelect
                options={stageOptions.map((opt) => ({
                    ...opt,
                    badgeClassName:
                        stageConfig[opt.value as CycleStage]?.className,
                }))}
                value={stages}
                onValueChange={onStagesChange}
                placeholder="All Stages"
                emptyText="No stages found"
                className="w-full lg:w-[150px] min-w-[max-content]"
                showClear
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
