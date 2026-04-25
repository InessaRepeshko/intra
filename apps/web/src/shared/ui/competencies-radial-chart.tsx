'use client';

import { LabelList, PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';

import { ReportAnalytics } from '@entities/reporting/individual-report/model/mappers';
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
import { StrategicReportAnalytics } from '@entities/reporting/strategic-report/model/mappers';

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

export function CompetenceRadialChart({
    reportAnalytics,
    title,
    description,
}: {
    reportAnalytics: ReportAnalytics[] | StrategicReportAnalytics[];
    title?: string;
    description?: string;
}) {
    const hasSelfData = reportAnalytics.some(
        (a) => a.percentageBySelfAssessment != null,
    );
    const hasTeamData = reportAnalytics.some((a) => a.percentageByTeam != null);
    const hasOthersData = reportAnalytics.some(
        (a) => a.percentageByOther != null,
    );

    const data: CompetenceRadialChartData[] = [];

    if (hasSelfData) {
        data.push({
            category: 'self',
            rating: calculateAverageNumberForArray(
                reportAnalytics
                    .map((a) => a.percentageBySelfAssessment)
                    .filter((val): val is number => typeof val === 'number'),
            ),
            fill: 'var(--color-self)',
        });
    }

    if (hasTeamData) {
        data.push({
            category: 'team',
            rating: calculateAverageNumberForArray(
                reportAnalytics
                    .map((a) => a.percentageByTeam)
                    .filter((val): val is number => typeof val === 'number'),
            ),
            fill: 'var(--color-team)',
        });
    }

    if (hasOthersData) {
        data.push({
            category: 'others',
            rating: calculateAverageNumberForArray(
                reportAnalytics
                    .map((a) => a.percentageByOther)
                    .filter((val): val is number => typeof val === 'number'),
            ),
            fill: 'var(--color-others)',
        });
    }

    return (
        <Card className="flex-1 min-w-[95px] w-full overflow-hidden">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title || 'Rating Alignment Overview'}</CardTitle>
                <CardDescription>
                    {description || 'A comparative analysis of skill proficiency levels across all competencies, segmented by rater category (self, team, and others).'}
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
