'use client';

import { Award, Flag, RefreshCcw, RotateCcw, Search } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { EntityType } from '@entities/reporting/analytics/model/types';
import { entityTypeConfig } from '@entities/reporting/analytics/ui/entity-type-badge';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { cn } from '@shared/lib/utils/cn';
import { DateRangePicker } from '@shared/ui/date-range-picker';
import { MultiSelect } from '@shared/ui/multi-select';

interface AnalyticsFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    entityTypes: string[];
    onEntityTypesChange: (value: string[]) => void;
    questions: string[];
    onQuestionsChange: (value: string[]) => void;
    competences: string[];
    onCompetencesChange: (value: string[]) => void;
    dateRange: DateRange | undefined;
    onDateRangeChange: (range: DateRange | undefined) => void;
    entityTypeOptions: EntityType[];
    questionOptions: { id: string | number; title: string }[];
    competenceOptions: { id: string | number; title: string }[];
    onReset: () => void;
}

export function AnalyticsFilters({
    search,
    onSearchChange,
    entityTypes,
    onEntityTypesChange,
    questions,
    onQuestionsChange,
    competences,
    onCompetencesChange,
    dateRange,
    onDateRangeChange,
    entityTypeOptions,
    questionOptions,
    competenceOptions,
    onReset,
}: AnalyticsFiltersProps) {
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
                    placeholder="Search by entity title..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 truncate text-sm"
                />
            </div>

            <MultiSelect
                options={entityTypeOptions?.map((opt) => ({
                    label: entityTypeConfig[opt]?.label || String(opt),
                    value: String(opt),
                    badgeClassName: entityTypeConfig[opt]?.className,
                }))}
                value={entityTypes}
                onValueChange={onEntityTypesChange}
                placeholder="All Entity Types"
                emptyText="No entity types found"
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<Flag className="h-4 w-4" />}
            />

            <MultiSelect
                options={questionOptions.map((opt) => ({
                    label: opt.title,
                    value: String(opt.id),
                }))}
                value={questions}
                onValueChange={onQuestionsChange}
                placeholder="All Questions"
                emptyText="No questions found"
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<RefreshCcw className="h-4 w-4" />}
            />

            <MultiSelect
                options={competenceOptions.map((opt) => ({
                    label: opt.title,
                    value: String(opt.id),
                }))}
                value={competences}
                onValueChange={onCompetencesChange}
                placeholder="All Competences"
                emptyText="No competences found"
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
