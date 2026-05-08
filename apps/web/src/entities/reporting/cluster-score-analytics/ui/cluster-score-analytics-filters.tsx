'use client';

import {
    ArrowDownToLine,
    ArrowUpToLine,
    Bookmark,
    Box,
    RefreshCcw,
    Search,
} from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { cn } from '@shared/lib/utils/cn';
import { DateRangePicker } from '@shared/ui/date-range-picker';
import { MultiSelect } from '@shared/ui/multi-select';
import { RotateCcw } from 'lucide-react';
<<<<<<< HEAD
import { getColorForLabel } from './cluster-badge';
=======
import { getHashColor } from './cluster-badge';
>>>>>>> main

interface ClusterScoreAnalyticsFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    dateRange: DateRange | undefined;
    onDateRangeChange: (range: DateRange | undefined) => void;
    clusterScores: string[];
    onClusterScoresChange: (value: string[]) => void;
    clusterScoreOptions: string[];
    competences: string[];
    onCompetencesChange: (value: string[]) => void;
    competenceOptions: string[];
    cycles: string[];
    onCyclesChange: (value: string[]) => void;
    cycleOptions: string[];
    lowerBounds: string[];
    onLowerBoundsChange: (value: string[]) => void;
    lowerBoundOptions: string[];
    upperBounds: string[];
    onUpperBoundsChange: (value: string[]) => void;
    upperBoundOptions: string[];
    onReset: () => void;
}

export function ClusterScoreAnalyticsFilters({
    search,
    onSearchChange,
    dateRange,
    onDateRangeChange,
    clusterScores,
    onClusterScoresChange,
    clusterScoreOptions,
    competences,
    onCompetencesChange,
    competenceOptions,
    cycles,
    onCyclesChange,
    cycleOptions,
    lowerBounds,
    onLowerBoundsChange,
    lowerBoundOptions,
    upperBounds,
    onUpperBoundsChange,
    upperBoundOptions,
    onReset,
}: ClusterScoreAnalyticsFiltersProps) {
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
<<<<<<< HEAD
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
=======
>>>>>>> main
                options={competenceOptions.map((opt) => ({
                    label: opt,
                    value: opt,
                }))}
                value={competences}
                onValueChange={onCompetencesChange}
                placeholder="All Competences"
                emptyText="No competences found"
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<Bookmark className="h-4 w-4" />}
            />

            <MultiSelect
                options={clusterScoreOptions.map((opt) => ({
                    label: opt,
                    value: opt,
<<<<<<< HEAD
                    badgeClassName: getColorForLabel(opt),
=======
                    badgeClassName: getHashColor(opt),
>>>>>>> main
                }))}
                value={clusterScores}
                onValueChange={onClusterScoresChange}
                placeholder="All Clusters"
                emptyText="No clusters found"
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<Box className="h-4 w-4" />}
            />

            <MultiSelect
                options={lowerBoundOptions.map((opt) => ({
                    label: opt,
                    value: opt,
                }))}
                value={lowerBounds}
                onValueChange={onLowerBoundsChange}
                placeholder="All Lower Bounds"
                emptyText="No lower bounds found"
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<ArrowDownToLine className="h-4 w-4" />}
            />

            <MultiSelect
                options={upperBoundOptions.map((opt) => ({
                    label: opt,
                    value: opt,
                }))}
                value={upperBounds}
                onValueChange={onUpperBoundsChange}
                placeholder="All Upper Bounds"
                emptyText="No upper bounds found"
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<ArrowUpToLine className="h-4 w-4" />}
            />

<<<<<<< HEAD
=======
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

>>>>>>> main
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
