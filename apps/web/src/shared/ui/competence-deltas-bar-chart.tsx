'use client';

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    XAxis,
    YAxis,
} from 'recharts';

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
import { formatNumber } from '@shared/lib/utils/format-number';

interface CompetenceDeltasBarChartData {
    id: number;
    competence: string;
    team: number;
    others: number;
}

const chartConfig = {
    team: {
        label: 'Team rating delta',
        color: 'var(--color-blue-400)',
    },
    others: {
        label: 'Others rating delta',
        color: 'var(--color-violet-400)',
    },
} satisfies ChartConfig;

export function CompetenceDeltasBarChart({
    reportAnalytics,
    title,
    description,
}: {
    reportAnalytics: ReportAnalytics[] | StrategicReportAnalytics[];
    title?: string;
    description?: string;
}) {
    const data: CompetenceDeltasBarChartData[] = [];

    let hasTeamData = false;
    let hasOthersData = false;

    reportAnalytics?.forEach((a) => {
        if (a.deltaPercentageByTeam != null) hasTeamData = true;
        if (a.deltaPercentageByOther != null) hasOthersData = true;

        return data.push({
            id: a.competenceId ?? 0,
            competence: a.competenceTitle ?? 'Competence',
            team: a.deltaPercentageByTeam ?? 0,
            others: a.deltaPercentageByOther ?? 0,
        });
    });

    const values = data.flatMap((d) => {
        const v: number[] = [];
        if (hasTeamData) v.push(d.team);
        if (hasOthersData) v.push(d.others);
        return v;
    });
    const minVal = Math.floor(Math.min(...values) / 10) * 10 - 10;
    const maxVal = Math.ceil(Math.max(...values) / 10) * 10 + 10;
    const customTicks: number[] = [];
    for (let i = minVal; i <= maxVal; i += 10) {
        customTicks.push(i);
    }
    data.sort((a, b) => a.competence.localeCompare(b.competence));

    return (
        data &&
        data.length > 0 &&
        hasTeamData &&
        hasOthersData && (
            <Card className="flex-1 min-w-[95px] w-full overflow-hidden">
                <CardHeader className="items-center">
                    <CardTitle>
                        {title || 'Perception Variance Analysis'}
                    </CardTitle>
                    <CardDescription>
                        {description ||
                            'The chart illustrates the percentage deviation between the participant\'s self-assessment and the aggregated ratings from team members and others. Upward bars reveal "Hidden Strengths," while downward bars pinpoint "Blind Spots".'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto max-h-[500px] " // w-full px-5
                    >
                        <BarChart
                            accessibilityLayer
                            data={data}
                            barCategoryGap={'30%'}
                            barSize={70}
                            margin={{ bottom: 10 }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="competence"
                                type="category"
                                height={30}
                                interval={0}
                                tickLine={false}
                                axisLine={false}
                                tick={({ x, y, payload }) => {
                                    const words = payload.value.split(/\s+/);
                                    const index = words.indexOf('&');
                                    if (index !== -1) {
                                        words[index + 1] =
                                            '& ' + words[index + 1];
                                        words.splice(index, 1);
                                    }
                                    return (
                                        <text
                                            x={x}
                                            y={y + 15}
                                            textAnchor="middle"
                                            className="text-[13px] font-medium"
                                            style={{
                                                fill: 'hsl(var(--foreground))',
                                            }}
                                        >
                                            {words.map(
                                                (word: string, i: number) => (
                                                    <tspan
                                                        key={i}
                                                        x={x}
                                                        dy={i === 0 ? 0 : 14}
                                                    >
                                                        {word}
                                                    </tspan>
                                                ),
                                            )}
                                        </text>
                                    );
                                }}
                            />
                            <YAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v: number) =>
                                    v > 0 ? `+${v}%` : `${v}%`
                                }
                                width={50}
                                domain={[minVal, maxVal]}
                                ticks={customTicks}
                            />

                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        indicator="line"
                                        labelKey="competence"
                                        formatter={(
                                            value,
                                            name,
                                            item,
                                            index,
                                        ) => {
                                            return (
                                                <div className="flex min-w-[180px] flex-col items-start text-xs text-muted-foreground">
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
                                                            {Number(value) > 0
                                                                ? `+${formatNumber(Number(value))}%`
                                                                : `${formatNumber(Number(value))}%`}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                }
                            />
                            <ChartLegend
                                className="mt-5 text-sm text-muted-foreground"
                                content={<ChartLegendContent />}
                            />
                            {hasTeamData && (
                                <Bar
                                    dataKey="team"
                                    fill="var(--color-team)"
                                    radius={10}
                                >
                                    <LabelList
                                        position="top"
                                        fillOpacity={1}
                                        fontSize={13}
                                        offset={8}
                                        formatter={(value: number) =>
                                            value > 0
                                                ? `+${formatNumber(value)}%`
                                                : `${formatNumber(value)}%`
                                        }
                                    />
                                    {data.map((item) => (
                                        <Cell
                                            key={item.competence}
                                            fill={'var(--color-team)'}
                                            fillOpacity={0.6}
                                        />
                                    ))}
                                </Bar>
                            )}
                            {hasOthersData && (
                                <Bar
                                    dataKey="others"
                                    fill="var(--color-others)"
                                    radius={10}
                                >
                                    <LabelList
                                        position="top"
                                        fillOpacity={1}
                                        fontSize={13}
                                        offset={8}
                                        formatter={(value: number) =>
                                            value > 0
                                                ? `+${formatNumber(value)}%`
                                                : `${formatNumber(value)}%`
                                        }
                                    />
                                    {data.map((item) => (
                                        <Cell
                                            key={item.competence}
                                            fill={'var(--color-others)'}
                                            fillOpacity={0.6}
                                        />
                                    ))}
                                </Bar>
                            )}
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        )
    );
}
