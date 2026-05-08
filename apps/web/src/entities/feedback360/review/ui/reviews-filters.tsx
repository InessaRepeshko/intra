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

import { ReviewStage } from '@entities/feedback360/review/model/types';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { cn } from '@shared/lib/utils/cn';
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-start flex-wrap">
            <div className="relative w-full flex-1 md:min-w-[300px] lg:max-w-sm">
                <Search
                    className={cn(
                        'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2',
                        !search ? 'text-muted-foreground' : 'text-foreground',
                    )}
                />
                <Input
<<<<<<< HEAD
                    placeholder="Search by id or ratee full name..."
=======
                    placeholder="Search by ratee full name..."
>>>>>>> main
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 truncate text-sm"
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
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<Flag className="h-4 w-4" />}
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
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<RefreshCcw className="h-4 w-4" />}
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
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<Award className="h-4 w-4" />}
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
