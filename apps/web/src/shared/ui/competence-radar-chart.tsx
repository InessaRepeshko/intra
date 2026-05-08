'use client';

import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
} from 'recharts';

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
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@shared/components/ui/chart';

interface CompetenceRadarCharData {
    competence: string;
    self: number;
    team: number;
    others: number;
}

const chartConfig = {
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

export function CompetenciesRadarChart({
    reportAnalytics,
}: {
    reportAnalytics: ReportAnalytics[];
}) {
    const data: CompetenceRadarCharData[] = [];

    reportAnalytics?.forEach((a) => {
        return data.push({
            competence: a.competenceTitle ?? 'Competence',
            self: a.percentageBySelfAssessment ?? 0,
            team: a.percentageByTeam ?? 0,
            others: a.percentageByOther ?? 0,
        });
    });

    return (
        <Card className="flex-1 min-w-[95px] w-full overflow-hidden">
            <CardHeader className="items-center">
                <CardTitle>Competence Alignment Overview</CardTitle>
                <CardDescription>
                    Multi-source evaluation of key skill clusters showing the
                    alignment between internal and external performance
                    perspectives.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto max-h-[500px]"
                >
                    <RadarChart
                        data={data}
                        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    >
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <PolarAngleAxis
                            dataKey="competence"
                            tick={({
                                x,
                                y,
                                textAnchor,
                                value,
                                index,
                                ...props
                            }) => {
                                const record = data[index];
                                return (
                                    <text
                                        x={x}
                                        y={index === 0 ? y - 10 : y}
                                        textAnchor={textAnchor}
                                        fontSize={14}
                                        fontWeight={500}
                                        {...props}
                                    >
                                        {/* <tspan className="fill-amber-500">
                                            {formatNumber(record.self) + '%'}
                                        </tspan>
                                        <tspan className="fill-muted-foreground">
                                            {' / '}
                                        </tspan>
                                        <tspan className="fill-blue-500">
                                            {formatNumber(record.team) + '%'}
                                        </tspan>
                                        <tspan className="fill-muted-foreground">
                                            {' / '}
                                        </tspan>
                                        <tspan className="fill-violet-500">
                                            {formatNumber(record.others) + '%'}
                                        </tspan> */}
                                        <tspan
                                            x={x}
                                            dy={'1rem'}
                                            fontSize={14}
                                            className="fill-foreground"
                                        >
                                            {record.competence}
                                        </tspan>
                                    </text>
                                );
                            }}
                        />
                        <PolarGrid />
                        <Radar
                            dataKey="self"
                            fill="var(--color-self)"
                            fillOpacity={0.1}
                            dot={{ r: 4, fillOpacity: 1 }}
                            stroke="var(--color-self)"
                            strokeWidth={2}
                        />
                        <Radar
                            dataKey="team"
                            fill="var(--color-team)"
                            fillOpacity={0.1}
                            dot={{ r: 4, fillOpacity: 1 }}
                            stroke="var(--color-team)"
                            strokeWidth={2}
                        />
                        <Radar
                            dataKey="others"
                            fill="var(--color-others)"
                            fillOpacity={0.1}
                            dot={{ r: 4, fillOpacity: 1 }}
                            stroke="var(--color-others)"
                            strokeWidth={2}
                        />
                        <ChartLegend
                            className="mt-8 text-sm text-muted-foreground"
                            content={<ChartLegendContent />}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
