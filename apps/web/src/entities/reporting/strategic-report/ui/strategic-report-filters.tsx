'use client';

import {
    Award,
    Flag,
    RefreshCcw,
    RotateCcw,
    Search,
    Users,
} from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { stageConfig } from '@entities/feedback360/review/ui/stage-badge';
import { ReviewStage } from '@entities/reporting/individual-report/model/types';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { cn } from '@shared/lib/utils/cn';
import { DateRangePicker } from '@shared/ui/date-range-picker';
import { MultiSelect } from '@shared/ui/multi-select';

interface StrategicReportsFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    dateRange: DateRange | undefined;
    onDateRangeChange: (range: DateRange | undefined) => void;
    cycles: string[];
    onCyclesChange: (value: string[]) => void;
    teams: string[];
    onTeamsChange: (value: string[]) => void;
    cycleOptions: { id: string | number; title: string }[];
    teamOptions: { id: string | number; title: string }[];
    onReset: () => void;
}

export function StrategicReportsFilters({
    search,
    onSearchChange,
    dateRange,
    onDateRangeChange,
    cycles,
    onCyclesChange,
    teams,
    onTeamsChange,
    cycleOptions,
    teamOptions,
    onReset,
}: StrategicReportsFiltersProps) {
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
                    placeholder="Search by report id or cycle title..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 truncate text-sm"
                />
            </div>

            <MultiSelect
                options={cycleOptions.map((opt) => ({
                    label: opt.title,
                    value: String(opt.id),
                }))}
                value={cycles}
                onValueChange={onCyclesChange}
                placeholder="All Cycles"
                emptyText="No cycles found"
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<RefreshCcw className="h-4 w-4" />}
            />

            <MultiSelect
                options={teamOptions.map((opt) => ({
                    label: opt.title,
                    value: String(opt.id),
                }))}
                value={teams}
                onValueChange={onTeamsChange}
                placeholder="All Teams"
                emptyText="No teams found"
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<Users className="h-4 w-4" />}
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
