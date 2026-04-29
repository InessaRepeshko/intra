'use client';

import { useMemo } from 'react';
import {
    Area,
    CartesianGrid,
    ComposedChart,
    LabelList,
    Line,
    XAxis,
    YAxis,
} from 'recharts';

import type { ClusterScoreAnalytics } from '@entities/reporting/cluster-score-analytics/model/mappers';
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

const chartConfig = {
    corridorRange: {
        label: 'Expected score corridor',
        color: 'oklch(74.6% 0.16 232.661)',
    },
    averageScore: {
        label: 'Actual average score',
        color: 'oklch(62.7% 0.265 303.9)',
    },
} satisfies ChartConfig;

interface CorridorVsRealRatingChartProps {
    clusterScoreAnalytics: ClusterScoreAnalytics[];
    clusterTitles: Record<number, { title: string; competenceId: number }>;
    competenceTitles: Record<number, { title: string }>;
}

export function CorridorVsRealRatingChart({
    clusterScoreAnalytics,
    clusterTitles,
    competenceTitles,
}: CorridorVsRealRatingChartProps) {
    const chartData = useMemo(() => {
        return clusterScoreAnalytics.map((entry) => {
            const clusterData = clusterTitles[entry.clusterId];
            const competenceTitle = clusterData
                ? competenceTitles[clusterData.competenceId]?.title
                : undefined;
            return {
                cluster: clusterData?.title ?? `Cluster ${entry.clusterId}`,
                competence:
                    competenceTitle ??
                    `Competence ${clusterData?.competenceId ?? ''}`,
                lowerBound: entry.lowerBound,
                upperBound: entry.upperBound,
                corridorRange: [entry.lowerBound, entry.upperBound],
                averageScore: entry.averageScore,
                inCorridor:
                    entry.averageScore >= entry.lowerBound &&
                    entry.averageScore <= entry.upperBound,
            };
        });
    }, [clusterScoreAnalytics, clusterTitles, competenceTitles]);

    if (chartData.length === 0) return null;

    chartData.sort((a, b) => a.competence.localeCompare(b.competence));

    const allValues = chartData.flatMap((d) => [
        d.lowerBound,
        d.upperBound,
        d.averageScore,
    ]);
    const yMin = Math.max(0, Math.floor(Math.min(...allValues) / 10) * 10);
    const yMax = Math.min(5, Math.ceil(Math.max(...allValues) / 10) * 10);

    return (
        <Card className="flex-1 min-w-[95px] w-full overflow-hidden">
            <CardHeader className="items-center">
                <CardTitle>Performance VS Expectation Benchmarking</CardTitle>
                <CardDescription>
                    Expected proficiency corridor (lower–upper bound) compared
                    against actual average scores per cluster. Points inside the
                    shaded area meet position standards.
                </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto pb-4">
                <div className="min-w-[800px] w-full">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-auto h-[450px] w-full"
                    >
                        <ComposedChart
                            accessibilityLayer
                            data={chartData}
                            margin={{ top: 20, right: 30, bottom: 0, left: 10 }}
                            barCategoryGap="20%"
                        >
                            <CartesianGrid
                                vertical={true}
                                strokeDasharray="3 3"
                            />
                            <XAxis
                                dataKey="competence"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                height={30}
                                interval={0}
                                tick={({ x, y, payload, index, length }) => {
                                    const words = payload.value.split(' ');
                                    const position = words.findIndex(
                                        (word: string) => word === '&',
                                    );
                                    if (position !== -1) {
                                        words[position + 1] =
                                            '& ' + words[position + 1];
                                        words.splice(position, 1);
                                    }

                                    return (
                                        <g
                                            transform={`translate(${x}, ${y + 10})`}
                                        >
                                            <text
                                                textAnchor="middle"
                                                className="text-[12px] font-medium"
                                                style={{
                                                    fill: 'hsl(var(--foreground))',
                                                }}
                                            >
                                                {words.map(
                                                    (
                                                        word: string,
                                                        index: number,
                                                    ) => (
                                                        <tspan
                                                            x={0}
                                                            dy={
                                                                index === 0
                                                                    ? 0
                                                                    : 14
                                                            }
                                                            key={index}
                                                        >
                                                            {word}
                                                        </tspan>
                                                    ),
                                                )}
                                            </text>
                                        </g>
                                    );
                                }}
                            />
                            <YAxis
                                yAxisId="numbers"
                                orientation="left"
                                type="number"
                                domain={[yMin, yMax]}
                                axisLine={false}
                                tickLine={false}
                                tickMargin={8}
                                tickCount={yMax - yMin + 1}
                                tickFormatter={(v: number) => `${v}`}
                                width={40}
                            ></YAxis>
                            <YAxis
                                yAxisId="clusters"
                                orientation="left"
                                type="number"
                                domain={[yMin, yMax]}
                                axisLine={false}
                                tickLine={false}
                                ticks={[0.5, 1.5, 2.5, 3.5, 4.5]}
                                tickFormatter={(v) => {
                                    if (v === 0.5) return 'Beginner';
                                    if (v === 1.5) return 'Novice';
                                    if (v === 2.5) return 'Intermediate';
                                    if (v === 3.5) return 'Advanced';
                                    if (v === 4.5) return 'Expert';
                                    return '';
                                }}
                                width={80}
                                tick={{
                                    fontSize: 12,
                                    fill: 'hsl(var(--muted-foreground))',
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(label, payload) => {
                                            const clusterName =
                                                payload?.[0]?.payload?.cluster;
                                            return (
                                                <div className="flex flex-col gap-2 pb-1">
                                                    <span className="font-semibold text-foreground leading-none">
                                                        <span className="text-muted-foreground font-normal">
                                                            Competence:
                                                        </span>{' '}
                                                        {label}
                                                    </span>
                                                    {clusterName && (
                                                        <span className="text-xs text-muted-foreground font-normal leading-none">
                                                            Level:{' '}
                                                            <span className="font-medium text-foreground">
                                                                {clusterName}
                                                            </span>
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        }}
                                        formatter={(value, name) => (
                                            <div className="flex items-center justify-start gap-1 w-full p-0 m-0">
                                                <div
                                                    className="h-2.5 w-1 shrink-0 rounded-[2px] bg-(--color-bg) mr-1"
                                                    style={
                                                        {
                                                            '--color-bg': `var(--color-${name})`,
                                                        } as React.CSSProperties
                                                    }
                                                />
                                                <div className="text-muted-foreground">
                                                    {chartConfig[
                                                        name as keyof typeof chartConfig
                                                    ]?.label ?? name}
                                                </div>
                                                <div className="ml-auto flex items-center justify-end gap-0.5 font-mono font-medium text-foreground">
                                                    {Array.isArray(value)
                                                        ? `[${formatNumber(Number(value[0]))};${formatNumber(Number(value[1]))}${Number(value[1]) === 5 ? ']' : ')'}`
                                                        : `${formatNumber(Number(value))}`}
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

                            {/* Corridor shading via Area */}
                            <Area
                                yAxisId="numbers"
                                dataKey="corridorRange"
                                type="monotone"
                                fill="var(--color-corridorRange)"
                                fillOpacity={0.2}
                                stroke="var(--color-corridorRange)"
                                strokeWidth={1}
                                strokeDasharray="5 5"
                                connectNulls
                            />

                            {/* Actual score line */}
                            <Line
                                yAxisId="numbers"
                                dataKey="averageScore"
                                type="monotone"
                                stroke="var(--color-averageScore)"
                                strokeWidth={3}
                                dot={(props: Record<string, unknown>) => {
                                    const { cx, cy, payload, key } = props as {
                                        cx: number;
                                        cy: number;
                                        payload: { inCorridor: boolean };
                                        key: string;
                                    };
                                    return (
                                        <circle
                                            key={key}
                                            cx={cx}
                                            cy={cy}
                                            r={6}
                                            fill={
                                                payload.inCorridor
                                                    ? 'oklch(72.3% 0.219 149.579)'
                                                    : 'oklch(63.7% 0.237 25.331)'
                                            }
                                            stroke="hsl(var(--background))"
                                            strokeWidth={2}
                                        />
                                    );
                                }}
                            >
                                <LabelList
                                    dataKey="averageScore"
                                    position="top"
                                    offset={12}
                                    className="fill-foreground font-semibold text-[12px]"
                                    formatter={(val: number) =>
                                        formatNumber(val)
                                    }
                                />
                            </Line>
                        </ComposedChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    );
}
