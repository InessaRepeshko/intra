'use client';

import { LabelList, PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';

import { ReportAnalytics } from '@entities/reporting/report/model/mappers';
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
import { calculateAverageNumberForArray } from '@shared/lib/utils/calculate-average';

interface CompetenceRadialChartData {
    category: string;
    rating: number;
    fill: string;
}

const chartConfig = {
    rating: {
        label: 'Rating %',
    },
    self: {
        label: 'Self',
        color: 'var(--color-amber-400)',
    },
    team: {
        label: 'Team',
        color: 'var(--color-blue-400)',
    },
    others: {
        label: 'Others',
        color: 'var(--color-violet-400)',
    },
} satisfies ChartConfig;

export function CompetenciesRadialChart({
    reportAnalytics,
}: {
    reportAnalytics: ReportAnalytics[];
}) {
    const data: CompetenceRadialChartData[] = [
        {
            category: 'self',
            rating: calculateAverageNumberForArray(
                reportAnalytics.map((a) => a.percentageBySelfAssessment ?? 0),
            ),
            fill: 'var(--color-self)',
        },
        {
            category: 'team',
            rating: calculateAverageNumberForArray(
                reportAnalytics.map((a) => a.percentageByTeam ?? 0),
            ),
            fill: 'var(--color-team)',
        },
        {
            category: 'others',
            rating: calculateAverageNumberForArray(
                reportAnalytics.map((a) => a.percentageByOther ?? 0),
            ),
            fill: 'var(--color-others)',
        },
    ];

    return (
        <Card className="flex-1 min-w-[95px] w-full overflow-hidden">
            <CardHeader className="items-center pb-0">
                <CardTitle>Rating Alignment Overview</CardTitle>
                <CardDescription>
                    A comparative analysis of skill proficiency levels across
                    all competencies, segmented by rater category (self, team,
                    and others).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto max-h-[500px]"
                >
                    <RadialBarChart
                        data={data}
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
                                    hideLabel
                                    nameKey="category"
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
                        </RadialBar>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
