'use client';

import { LabelList, PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';

<<<<<<< HEAD
import { ReportAnalytics } from '@entities/reporting/individual-report/model/mappers';
import { StrategicReportAnalytics } from '@entities/reporting/strategic-report/model/mappers';
=======
import { ReportAnalytics } from '@entities/reporting/report/model/mappers';
>>>>>>> main
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@shared/components/ui/chart';
<<<<<<< HEAD
import { formatNumber } from '@shared/lib/utils/format-number';

interface CompetenceRadialChartData {
    category: string;
    name: string;
=======

interface CompetenceRadialChartData {
    category: string;
>>>>>>> main
    rating: number;
    fill: string;
}

interface CompetenceRadialChartsData {
    id: number;
    competence: string;
    ratings: CompetenceRadialChartData[];
}

const chartConfig = {
    rating: {
<<<<<<< HEAD
        label: 'Rating',
    },
    self: {
        label: 'Self rating',
        color: 'var(--color-amber-400)',
    },
    team: {
        label: 'Team rating',
        color: 'var(--color-blue-400)',
    },
    others: {
        label: 'Others rating',
=======
        label: 'Rating %',
    },
    self: {
        label: 'Self',
        // color: 'var(--color-slate-400)',
        color: 'var(--color-amber-400)',
    },
    team: {
        label: 'Team',
        // color: 'var(--color-slate-600)',
        color: 'var(--color-blue-400)',
    },
    others: {
        label: 'Others',
        // color: 'var(--color-slate-900)',
>>>>>>> main
        color: 'var(--color-violet-400)',
    },
} satisfies ChartConfig;

export function CompetenciesRadialChartsGroup({
    reportAnalytics,
<<<<<<< HEAD
    title,
    description,
}: {
    reportAnalytics: ReportAnalytics[] | StrategicReportAnalytics[];
    title?: string;
    description?: string;
}) {
    const data: CompetenceRadialChartsData[] = [];

    const hasSelfData = reportAnalytics.some(
        (a) => a.percentageBySelfAssessment != null,
    );
    const hasTeamData = reportAnalytics.some((a) => a.percentageByTeam != null);
    const hasOthersData = reportAnalytics.some(
        (a) => a.percentageByOther != null,
    );

    reportAnalytics?.forEach((a) => {
        const ratings: CompetenceRadialChartData[] = [];

        if (hasSelfData) {
            ratings.push({
                category: 'self',
                name: 'Self rating',
                rating: a.percentageBySelfAssessment ?? 0,
                fill: 'var(--color-self)',
            });
        }

        if (hasTeamData) {
            ratings.push({
                category: 'team',
                name: 'Team rating',
                rating: a.percentageByTeam ?? 0,
                fill: 'var(--color-team)',
            });
        }

        if (hasOthersData) {
            ratings.push({
                category: 'others',
                name: 'Others rating',
                rating: a.percentageByOther ?? 0,
                fill: 'var(--color-others)',
            });
        }

        return data.push({
            id: a.competenceId ?? 0,
            competence: a.competenceTitle ?? '',
            ratings,
        });
    });

    data.sort((a, b) => a.competence.localeCompare(b.competence));

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="items-center pb-0">
                <CardTitle>
                    {title || 'Individual Competence Profiles'}
                </CardTitle>
                <CardDescription>
                    {description ||
                        'A comparative analysis of skill proficiency levels for each competence, segmented by rater category (self, team, and others).'}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row flex-wrap pb-0 justify-center gap-6 pt-0">
                {data.map((competenceData, index) => (
=======
}: {
    reportAnalytics: ReportAnalytics[];
}) {
    const data: CompetenceRadialChartsData[] = [];

    reportAnalytics?.forEach((a) => {
        return data.push({
            id: a.competenceId ?? 0,
            competence: a.competenceTitle ?? '',
            ratings: [
                {
                    category: 'self',
                    rating: a.percentageBySelfAssessment ?? 0,
                    fill: 'var(--color-self)',
                },
                {
                    category: 'team',
                    rating: a.percentageByTeam ?? 0,
                    fill: 'var(--color-team)',
                },
                {
                    category: 'others',
                    rating: a.percentageByTeam ?? 0,
                    fill: 'var(--color-others)',
                },
            ],
        });
    });

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="items-center pb-0">
                <CardTitle>Individual Competence Profiles</CardTitle>
                <CardDescription>
                    A comparative analysis of skill proficiency levels for each
                    competence, segmented by rater category (self, team, and
                    others).
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row flex-wrap pb-0 justify-center gap-6 pt-0">
                {data.map((competenceData) => (
>>>>>>> main
                    <div
                        key={competenceData.id}
                        className="flex flex-col items-center flex-1 min-w-[200px] max-w-[250px]"
                    >
                        <span className="text-base font-medium text-center mb-0 h-8 flex items-center line-clamp-2">
                            {competenceData.competence}
                        </span>
                        <ChartContainer
                            config={chartConfig}
                            className="w-full aspect-square"
                        >
                            <RadialBarChart
                                data={competenceData.ratings}
                                innerRadius="30%"
                                outerRadius="100%"
                                startAngle={-90}
                                endAngle={270}
                            >
                                <PolarAngleAxis
                                    type="number"
                                    domain={[0, 100]}
                                    angleAxisId={0}
                                    tick={false}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
<<<<<<< HEAD
                                            indicator="line"
                                            labelKey="name"
                                            formatter={(value, name, item) => (
                                                <div className="flex min-w-[150px] flex-col items-start text-xs text-muted-foreground">
                                                    <div className="flex items-center justify-start gap-1 w-full p-0 m-0">
                                                        <span
                                                            className="h-2.5 w-1 shrink-0 rounded-[2px] mr-1"
                                                            style={{
                                                                backgroundColor:
                                                                    item.payload
                                                                        .fill ||
                                                                    item.fill,
                                                            }}
                                                        />
                                                        <span>
                                                            {item.payload.name}
                                                        </span>
                                                        <span className="ml-auto flex items-center justify-end gap-0.5 font-mono font-medium text-foreground tabular-nums">
                                                            {formatNumber(
                                                                Number(value),
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
=======
                                            hideLabel
                                            nameKey="category"
>>>>>>> main
                                        />
                                    }
                                />
                                <RadialBar
                                    dataKey="rating"
                                    background
                                    fillOpacity={0.6}
                                    cornerRadius={10}
                                >
                                    <LabelList
                                        position="insideStart"
                                        dataKey="category"
                                        className="fill-white capitalize mix-blend-luminosity"
                                        fontSize={13}
                                    />
<<<<<<< HEAD
                                    <LabelList
                                        position="insideEnd"
                                        dataKey="rating"
                                        className="fill-white font-semibold"
                                        fontSize={13}
                                        formatter={(value: number) =>
                                            `${formatNumber(value)}%`
                                        }
                                    />
=======
>>>>>>> main
                                </RadialBar>
                            </RadialBarChart>
                        </ChartContainer>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
