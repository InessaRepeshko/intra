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
import { formatNumber } from '@shared/lib/utils/format-number';

interface CompetenceChartBarData {
    id: number;
    competence: string;
    team: number;
    others: number;
}

const chartData = [
    { competence: 'competence1', team: 186, others: 186 },
    { competence: 'competence2', team: 205, others: -186 },
    { competence: 'competence3', team: -207, others: 186 },
    { competence: 'competence5', team: 173, others: -186 },
    { competence: 'competence6', team: -209, others: 186 },
    { competence: 'competence7', team: 214, others: 186 },
];

const chartConfig = {
    team: {
        label: 'Team delta %',
        color: 'var(--color-blue-400)',
    },
    others: {
        label: 'Others delta %',
        color: 'var(--color-violet-400)',
    },
    // competence: {
    //     label: 'Self',
    //     // color: 'var(--color-slate-400)',
    //     color: 'var(--color-amber-400)',
    // },
    // delta: {
    //     label: 'Team',
    //     // color: 'var(--color-slate-600)',
    //     color: 'var(--color-blue-400)',
    // },
    // competence: {
    //     label: 'Others',
    //     // color: 'var(--color-slate-900)',
    //     color: 'var(--color-violet-400)',
    // },
} satisfies ChartConfig;

export function CompetenciesBarChart({
    reportAnalytics,
}: {
    reportAnalytics: ReportAnalytics[];
}) {
    const data: CompetenceChartBarData[] = [];

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

    return (
        data &&
        data.length > 0 &&
        hasTeamData &&
        hasOthersData && (
            <Card className="flex-1 min-w-[95px] w-full overflow-hidden">
                <CardHeader className="items-center">
                    <CardTitle>Perception Variance Analysis</CardTitle>
                    <CardDescription>
                        The chart illustrates the percentage deviation between
                        the participant's self-assessment and the aggregated
                        ratings from team members and others. Upward bars reveal
                        "Hidden Strengths," while downward bars pinpoint "Blind
                        Spots".
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto max-h-[500px]"
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
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tick={({ x, y, payload }) => (
                                    <text
                                        x={x}
                                        y={y + 15}
                                        textAnchor="middle"
                                        className="text-[13px] font-medium"
                                        style={{
                                            fill: 'hsl(var(--foreground))',
                                        }}
                                    >
                                        {payload.value}
                                    </text>
                                )}
                            />
                            <YAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={() => ''}
                                width={0}
                                domain={[minVal, maxVal]}
                                ticks={customTicks}
                            />

                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        indicator="line"
                                        labelKey="competence"
                                        formatter={(value, name) => (
                                            <div className="flex min-w-[150px] items-center text-xs text-muted-foreground">
                                                <div
                                                    className="h-2.5 w-1 shrink-0 rounded-[2px] bg-(--color-bg) mr-1"
                                                    style={
                                                        {
                                                            '--color-bg': `var(--color-${name})`,
                                                        } as React.CSSProperties
                                                    }
                                                />
                                                {chartConfig[
                                                    name as keyof typeof chartConfig
                                                ]?.label || name}
                                                <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium text-foreground tabular-nums">
                                                    {Number(value) > 0
                                                        ? `+${formatNumber(Number(value))}%`
                                                        : `${formatNumber(Number(value))}%`}
                                                </div>
                                            </div>
                                        )}
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
                                    {/* <LabelList position="inside" dataKey="competence" fillOpacity={1} fontSize={13} className="fill-white" offset={8} /> */}
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
                                            fill={
                                                item.team > 0
                                                    ? 'var(--color-team)'
                                                    : 'var(--color-team)'
                                            }
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
                                    {/* <LabelList position="inside" dataKey="competence" fillOpacity={1} fontSize={13} className="fill-white" offset={8} /> */}
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
                                            fill={
                                                item.others > 0
                                                    ? 'var(--color-others)'
                                                    : 'var(--color-others)'
                                            }
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
