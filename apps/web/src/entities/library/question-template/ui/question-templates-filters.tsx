'use client';

import {
    Award,
    Bookmark,
    FileQuestionMark,
    MessageSquareQuote,
    Search,
    ToggleLeft,
} from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import {
    AnswerType,
    ForSelfassessmentType,
    QuestionTemplateStatus,
} from '@entities/library/question-template/model/types';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { cn } from '@shared/lib/utils/cn';
import { DateRangePicker } from '@shared/ui/date-range-picker';
import { MultiSelect } from '@shared/ui/multi-select';
import { RotateCcw } from 'lucide-react';
import { answerTypeConfig } from './answer-type-badge';
import { forSelfAssessmentConfig } from './is-for-self-assessment-badge';
import { statusConfig } from './status-badge';

interface ReviewsFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    statuses: string[];
    onStatusesChange: (value: string[]) => void;
    answerTypes: string[];
    onAnswerTypesChange: (value: string[]) => void;
    forSelfassessmentTypes: string[];
    onForSelfassessmentChange: (value: string[]) => void;
    dateRange: DateRange | undefined;
    onDateRangeChange: (range: DateRange | undefined) => void;
    positions: string[];
    onPositionsChange: (value: string[]) => void;
    competences: string[];
    onCompetencesChange: (value: string[]) => void;
    statusOptions: QuestionTemplateStatus[];
    answerTypeOptions: AnswerType[];
    forSelfassessmentOptions: ForSelfassessmentType[];
    competenceOptions: { id: string | number; title: string }[];
    positionOptions: { id: string | number; title: string }[];
    onReset: () => void;
}

export function QuestionTemplatesFilters({
    search,
    onSearchChange,
    statuses,
    onStatusesChange,
    answerTypes,
    onAnswerTypesChange,
    forSelfassessmentTypes,
    onForSelfassessmentChange,
    dateRange,
    onDateRangeChange,
    positions,
    onPositionsChange,
    competences,
    onCompetencesChange,
    statusOptions,
    answerTypeOptions,
    forSelfassessmentOptions,
    positionOptions,
    competenceOptions,
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
                    placeholder="Search by question title..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 truncate text-sm"
                />
            </div>

            <MultiSelect
                options={forSelfassessmentOptions.map((opt) => ({
                    label: forSelfAssessmentConfig[opt]?.label || String(opt),
                    value: String(opt),
                    badgeClassName: forSelfAssessmentConfig[opt]?.className,
                    icon: forSelfAssessmentConfig[opt]?.icon,
                }))}
                value={forSelfassessmentTypes}
                onValueChange={onForSelfassessmentChange}
                placeholder="All Question Types"
                emptyText="No question types found"
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<FileQuestionMark className="h-4 w-4" />}
            />

            <MultiSelect
                options={answerTypeOptions.map((opt) => ({
                    label: answerTypeConfig[opt]?.label || String(opt),
                    value: String(opt).toUpperCase(),
                    badgeClassName: answerTypeConfig[opt]?.className,
                }))}
                value={answerTypes}
                onValueChange={onAnswerTypesChange}
                placeholder="All Answer Types"
                emptyText="No answer types found"
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<MessageSquareQuote className="h-4 w-4" />}
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
                icon={<Bookmark className="h-4 w-4" />}
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

            <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={onDateRangeChange}
            />

            <MultiSelect
                options={statusOptions.map((opt) => ({
                    label: statusConfig[opt]?.label || String(opt),
                    value: String(opt),
                    badgeClassName: statusConfig[opt]?.className,
                }))}
                value={statuses}
                onValueChange={onStatusesChange}
                placeholder="All Statuses"
                emptyText="No statuses found"
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<ToggleLeft className="h-4 w-4" />}
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
