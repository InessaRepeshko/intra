'use client';

import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
} from 'recharts';

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
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@shared/components/ui/chart';
<<<<<<< HEAD
import { formatNumber } from '@shared/lib/utils/format-number';
=======
>>>>>>> main

interface CompetenceRadarCharData {
    competence: string;
    self: number;
    team: number;
    others: number;
}

const chartConfig = {
    self: {
<<<<<<< HEAD
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
        label: 'Self',
        color: 'var(--color-amber-400)',
    },
    team: {
        label: 'Team',
        color: 'var(--color-blue-400)',
    },
    others: {
        label: 'Others',
>>>>>>> main
        color: 'var(--color-violet-400)',
    },
} satisfies ChartConfig;

<<<<<<< HEAD
export function CompetenceRadarChart({
    reportAnalytics,
    title,
    description,
}: {
    reportAnalytics: ReportAnalytics[] | StrategicReportAnalytics[];
    title?: string;
    description?: string;
}) {
    const data: CompetenceRadarCharData[] = [];

    let hasSelfData = false;
    let hasTeamData = false;
    let hasOthersData = false;

    reportAnalytics?.forEach((a) => {
        if (a.percentageBySelfAssessment != null) hasSelfData = true;
        if (a.percentageByTeam != null) hasTeamData = true;
        if (a.percentageByOther != null) hasOthersData = true;

=======
export function CompetenciesRadarChart({
    reportAnalytics,
}: {
    reportAnalytics: ReportAnalytics[];
}) {
    const data: CompetenceRadarCharData[] = [];

    reportAnalytics?.forEach((a) => {
>>>>>>> main
        return data.push({
            competence: a.competenceTitle ?? 'Competence',
            self: a.percentageBySelfAssessment ?? 0,
            team: a.percentageByTeam ?? 0,
            others: a.percentageByOther ?? 0,
        });
    });

<<<<<<< HEAD
    data.sort((a, b) => a.competence.localeCompare(b.competence));
    return (
        <Card className="flex-1 min-w-[95px] w-full overflow-hidden">
            <CardHeader className="items-center py-0 my-0">
                <CardTitle>
                    {title || 'Competence Alignment Overview'}
                </CardTitle>
                <CardDescription>
                    {description ||
                        'Multi-source evaluation of key skill clusters showing the alignment between internal and external performance perspectives.'}
=======
    return (
        <Card className="flex-1 min-w-[95px] w-full overflow-hidden">
            <CardHeader className="items-center">
                <CardTitle>Competence Alignment Overview</CardTitle>
                <CardDescription>
                    Multi-source evaluation of key skill clusters showing the
                    alignment between internal and external performance
                    perspectives.
>>>>>>> main
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto max-h-[500px]"
                >
                    <RadarChart
                        data={data}
<<<<<<< HEAD
                        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        cx="50%"
                        cy="50%"
                        outerRadius="100%"
                    >
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tickCount={6}
                            axisLine={false}
                            tick={{
                                fill: 'hsl(var(--muted-foreground))',
                                fontSize: 12,
                                dy: 15,
                                dx: 0,
                                textAnchor: 'start',
                            }}
                            tickFormatter={(value) =>
                                `${formatNumber(value, 0)}%`
                            }
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    indicator="line"
                                    labelKey="competence"
                                    formatter={(value, name, item, index) => {
                                        return (
                                            <div className="flex min-w-[150px] flex-col items-start text-xs text-muted-foreground">
                                                {index === 0 && (
                                                    <div className="text-foreground font-medium mb-1">
                                                        {
                                                            item.payload
                                                                .competence
                                                        }
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-start gap-1 w-full p-0 m-0">
                                                    <span
                                                        className="h-2.5 w-1 shrink-0 rounded-[2px] bg-(--color-bg) mr-1"
                                                        style={{
                                                            backgroundColor:
                                                                item.fill,
                                                        }}
                                                    ></span>
                                                    <span>
                                                        {chartConfig[
                                                            name as keyof typeof chartConfig
                                                        ]?.label || name}
                                                    </span>
                                                    <span className="ml-auto flex items-center justify-end gap-0.5 font-mono font-medium text-foreground">
                                                        {formatNumber(
                                                            Number(value),
                                                        )}
                                                        %
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                            }
=======
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
>>>>>>> main
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
<<<<<<< HEAD
                                        y={index === 0 ? y - 12 : y}
=======
                                        y={index === 0 ? y - 10 : y}
>>>>>>> main
                                        textAnchor={textAnchor}
                                        fontSize={14}
                                        fontWeight={500}
                                        {...props}
                                    >
<<<<<<< HEAD
=======
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
>>>>>>> main
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
<<<<<<< HEAD
                        {hasSelfData && (
                            <Radar
                                dataKey="self"
                                fill="var(--color-self)"
                                fillOpacity={0.1}
                                dot={{ r: 4, fillOpacity: 1 }}
                                stroke="var(--color-self)"
                                strokeWidth={2}
                            />
                        )}
                        {hasTeamData && (
                            <Radar
                                dataKey="team"
                                fill="var(--color-team)"
                                fillOpacity={0.1}
                                dot={{ r: 4, fillOpacity: 1 }}
                                stroke="var(--color-team)"
                                strokeWidth={2}
                            />
                        )}
                        {hasOthersData && (
                            <Radar
                                dataKey="others"
                                fill="var(--color-others)"
                                fillOpacity={0.1}
                                dot={{ r: 4, fillOpacity: 1 }}
                                stroke="var(--color-others)"
                                strokeWidth={2}
                            />
                        )}
                        <ChartLegend
                            className="m-0 text-sm text-muted-foreground"
=======
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
>>>>>>> main
                            content={<ChartLegendContent />}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
