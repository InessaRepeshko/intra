'use client';

import { ReportAnalytics } from '@entities/reporting/individual-report/model/mappers';
import { StrategicReportAnalytics } from '@entities/reporting/strategic-report/model/mappers';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@shared/components/ui/chart';
import { calculateAverageNumberForArray } from '@shared/lib/utils/calculate-average';
import { formatNumber } from '@shared/lib/utils/format-number';
import {
    Cell,
    LabelList,
    PolarAngleAxis,
    RadialBar,
    RadialBarChart,
} from 'recharts';

interface CompetenceRadialChartData {
    category: string;
    name: string;
    rating: number;
    fill: string;
}

const chartConfig = {
    rating: {
        label: 'Rating %',
    },
    self: {
        label: 'Self average rating',
        color: 'var(--color-amber-400)',
    },
    team: {
        label: 'Team average rating',
        color: 'var(--color-blue-400)',
    },
    others: {
        label: 'Others average rating',
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
            name: 'Self average rating',
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
            name: 'Team average rating',
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
            name: 'Others average rating',
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
                    {description ||
                        'A comparative analysis of skill proficiency levels across all competencies, segmented by rater category (self, team, and others).'}
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
                                    indicator="line"
                                    labelKey="name"
                                    formatter={(value, name, item) => (
                                        <div className="flex min-w-[180px] flex-col items-start text-xs text-muted-foreground">
                                            <div className="flex items-center justify-start gap-1 w-full p-0 m-0">
                                                <span
                                                    className="h-2.5 w-1 shrink-0 rounded-[2px] mr-1"
                                                    style={{
                                                        backgroundColor:
                                                            item.payload.fill ||
                                                            item.fill,
                                                    }}
                                                />
                                                <span>{item.payload.name}</span>
                                                <span className="ml-auto flex items-center justify-end gap-0.5 font-mono font-medium text-foreground tabular-nums">
                                                    {formatNumber(
                                                        Number(value),
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                />
                            }
                        />
                        <RadialBar
                            dataKey="rating"
                            background
                            fillOpacity={0.6}
                            cornerRadius={50}
                        >
                            {data.map((entry) => (
                                <Cell key={entry.category} fill={entry.fill} />
                            ))}
                            <LabelList
                                position="insideStart"
                                dataKey="category"
                                className="fill-white capitalize mix-blend-luminosity"
                                fontSize={13}
                            />
                            <LabelList
                                position="insideEnd"
                                dataKey="rating"
                                className="fill-white font-semibold"
                                fontSize={13}
                                formatter={(value: number) =>
                                    `${formatNumber(value)}%`
                                }
                            />
                        </RadialBar>
                        <ChartLegend
                            className="m-0 text-sm text-muted-foreground"
                            content={<ChartLegendContent nameKey="category" />}
                        />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
