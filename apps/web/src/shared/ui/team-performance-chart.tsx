'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Field, FieldLabel } from '@shared/components/ui/field';
import { Progress } from '@shared/components/ui/progress';
import { formatNumber } from '@shared/lib/utils/format-number';
import { Percent } from 'lucide-react';

interface TeamPerformanceData {
    teamId: number;
    teamTitle: string;
    averageRating: number;
    employeesCount: number;
    color?: string;
}

export function TeamProgressWithLabel({
    teamId,
    teamTitle,
    averageRating,
    employeesCount,
    color,
}: TeamPerformanceData) {
    return (
        <Field className="w-full">
            <FieldLabel htmlFor={teamId.toString()}>
                <span className="font-semibold text-base">{teamTitle}</span>
                <span className="text-sm text-muted-foreground border border-black-500 rounded-lg px-1.5 py-0.5 ml-2">
                    {employeesCount}{' '}
                    {employeesCount === 1 ? 'employee' : 'employees'}
                </span>
                <span className="ml-auto flex flex-row gap-1 items-center justify-center">
                    <span className="font-semibold">
                        {formatNumber(averageRating || 0, 2)}
                    </span>
                    <Percent className="shrink-0 h-4 w-4 text-muted-foreground" />
                </span>
            </FieldLabel>
            <Progress
                value={averageRating}
                id={teamId.toString()}
                indicatorClassName={color ? color : 'bg-emerald-400'}
                className="h-4"
                aria-label={teamTitle}
            />
        </Field>
    );
}

export function TeamPerformanceProgressChart({
    teamPerformanceData,
    title,
    description,
}: {
    teamPerformanceData: TeamPerformanceData[];
    title?: string;
    description?: string;
}) {
    return (
        teamPerformanceData &&
        teamPerformanceData.length > 0 && (
            <Card className="flex-1 min-w-[95px] w-full overflow-hidden">
                <CardHeader className="items-center">
                    <CardTitle>{title || 'Team Performance Ratings'}</CardTitle>
                    <CardDescription>
                        {description ||
                            'Comparison of average ratings across different organizational units. This view allows leadership to identify high-performing teams and departments that may require additional support or resource optimization.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-full mx-0 my-5">
                    <div className="flex flex-col gap-6 my-auto h-full justify-start items-center">
                        {teamPerformanceData
                            .sort((a, b) => b.averageRating - a.averageRating)
                            .map((item, index) => {
                                const TEAL_COLORS = [
                                    // 'bg-emerald-900',
                                    // 'bg-emerald-800',
                                    // 'bg-emerald-700',
                                    'bg-emerald-600',
                                    'bg-emerald-500',
                                    'bg-emerald-400',
                                    'bg-emerald-300',
                                    'bg-emerald-200',
                                    'bg-emerald-100',
                                ];
                                const color =
                                    TEAL_COLORS[index % TEAL_COLORS.length];
                                return (
                                    <TeamProgressWithLabel
                                        key={item.teamId}
                                        teamId={item.teamId}
                                        teamTitle={item.teamTitle}
                                        averageRating={item.averageRating}
                                        employeesCount={item.employeesCount}
                                        color={color}
                                    />
                                );
                            })}
                    </div>
                </CardContent>
            </Card>
        )
    );
}
