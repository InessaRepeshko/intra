'use client';

import { RotateCcw, Search } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { ReviewStage } from '@entities/feedback360/review/model/types';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { DateRangePicker } from '@shared/ui/date-range-picker';
import { MultiSelect } from '@shared/ui/multi-select';
import { stageConfig } from './stage-badge';

interface ReviewsFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    stages: string[];
    onStagesChange: (value: string[]) => void;
    dateRange: DateRange | undefined;
    onDateRangeChange: (range: DateRange | undefined) => void;
    cycles: string[];
    onCyclesChange: (value: string[]) => void;
    teams: string[];
    onTeamsChange: (value: string[]) => void;
    positions: string[];
    onPositionsChange: (value: string[]) => void;
    stageOptions: ReviewStage[];
    cycleOptions: string[];
    teamOptions: { id: string | number; title: string }[];
    positionOptions: { id: string | number; title: string }[];
    onReset: () => void;
}

export function ReviewsFilters({
    search,
    onSearchChange,
    stages,
    onStagesChange,
    dateRange,
    onDateRangeChange,
    cycles,
    onCyclesChange,
    teams,
    onTeamsChange,
    positions,
    onPositionsChange,
    stageOptions,
    cycleOptions,
    teamOptions,
    positionOptions,
    onReset,
}: ReviewsFiltersProps) {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center flex-wrap">
            <div className="relative flex-1 lg:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search by ratee full name..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9"
                />
            </div>

            <MultiSelect
                options={stageOptions.map((opt) => ({
                    label: stageConfig[opt]?.label || String(opt),
                    value: String(opt),
                    badgeClassName: stageConfig[opt]?.className,
                }))}
                value={stages}
                onValueChange={onStagesChange}
                placeholder="All Stages"
                emptyText="No stages found"
                className="w-full lg:w-[150px] min-w-[max-content]"
                showClear
            />

            <MultiSelect
                options={cycleOptions.map((opt) => ({
                    label: opt,
                    value: opt,
                }))}
                value={cycles}
                onValueChange={onCyclesChange}
                placeholder="All Cycles"
                emptyText="No cycles found"
                className="w-full lg:w-[150px] min-w-[max-content]"
                showClear
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
                className="w-full lg:w-[150px] min-w-[max-content]"
                showClear
            />

            <MultiSelect
                options={positionOptions.map((opt) => ({
                    label: opt.title,
                    value: String(opt.id),
                }))}
                value={positions}
                onValueChange={onPositionsChange}
                placeholder="All Positions"
                emptyText="No positions found"
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
