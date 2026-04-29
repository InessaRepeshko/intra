'use client';

import { useMemo } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Label,
    LabelList,
    Pie,
    PieChart,
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

/* ─── colour palette ─── */
const LEVEL_COLORS = {
    Expert: 'oklch(82.7% 0.119 306.383)', // purple-300
    Advanced: 'oklch(86.5% 0.127 207.078)', // cyan-300
    Intermediate: 'oklch(87.1% 0.15 154.449)', // green-300
    Novice: 'oklch(83.7% 0.128 66.29)', // orange-300
    Beginner: 'oklch(81% 0.117 11.638)', // rose-300
} as const;

type ProficiencyLevel = keyof typeof LEVEL_COLORS;

const stackedChartConfig = {
    Expert: {
        label: 'Expert',
        color: LEVEL_COLORS.Expert,
    },
    Advanced: {
        label: 'Advanced',
        color: LEVEL_COLORS.Advanced,
    },
    Intermediate: {
        label: 'Intermediate',
        color: LEVEL_COLORS.Intermediate,
    },
    Novice: {
        label: 'Novice',
        color: LEVEL_COLORS.Novice,
    },
    Beginner: {
        label: 'Beginner',
        color: LEVEL_COLORS.Beginner,
    },
} satisfies ChartConfig;

const pieChartConfig = {
    Expert: {
        label: 'Expert scores count',
        color: LEVEL_COLORS.Expert,
    },
    Advanced: {
        label: 'Advanced scores count',
        color: LEVEL_COLORS.Advanced,
    },
    Intermediate: {
        label: 'Intermediate scores count',
        color: LEVEL_COLORS.Intermediate,
    },
    Novice: {
        label: 'Novice scores count',
        color: LEVEL_COLORS.Novice,
    },
    Beginner: {
        label: 'Beginner scores count',
        color: LEVEL_COLORS.Beginner,
    },
} satisfies ChartConfig;

/* ─── helpers ─── */
function classifyLevel(averageScore: number): ProficiencyLevel {
    if (averageScore > 4) return 'Expert';
    if (averageScore > 3) return 'Advanced';
    if (averageScore > 2) return 'Intermediate';
    if (averageScore > 1) return 'Novice';
    return 'Beginner';
}

interface ClusterDistributionChartProps {
    analyticsData: ClusterScoreAnalytics[];
    cycleId: number;
    clusterTitles: Record<number, { title: string; competenceId: number }>;
    competenceTitles: Record<number, { title: string }>;
}

export function ClusterDistributionCharts({
    analyticsData,
    cycleId,
    clusterTitles,
    competenceTitles,
}: ClusterDistributionChartProps) {
    const filtered = useMemo(
        () => analyticsData.filter((d) => d.cycleId === cycleId),
        [analyticsData, cycleId],
    );

    /* ── stacked bar data ── */
    const stackedData = useMemo(() => {
        const competenceMap: Record<
            string,
            {
                competence: string;
                Expert: number;
                Advanced: number;
                Intermediate: number;
                Novice: number;
                Beginner: number;
            }
        > = {};

        filtered.forEach((entry) => {
            const cluster = clusterTitles[entry.clusterId];
            const competenceTitle = cluster
                ? (competenceTitles[cluster.competenceId]?.title ?? 'Unknown')
                : 'Unknown';

            if (!competenceMap[competenceTitle]) {
                competenceMap[competenceTitle] = {
                    competence: competenceTitle,
                    Expert: 0,
                    Advanced: 0,
                    Intermediate: 0,
                    Novice: 0,
                    Beginner: 0,
                };
            }

            const level = classifyLevel(entry.averageScore);
            competenceMap[competenceTitle][level] += entry.employeesCount;
        });

        return Object.values(competenceMap);
    }, [filtered, clusterTitles, competenceTitles]);

    const yTicks = useMemo(() => {
        if (stackedData.length === 0) return [];
        const yMax = Math.max(
            ...stackedData.map(
                (d) =>
                    (d.Beginner || 0) +
                    (d.Novice || 0) +
                    (d.Intermediate || 0) +
                    (d.Advanced || 0) +
                    (d.Expert || 0),
            ),
        );

        const step = Math.max(1, Math.ceil(yMax / 10));
        const maxTick = Math.ceil(yMax / step) * step;

        const ticks: number[] = [];
        for (let i = 0; i <= maxTick; i += step) {
            ticks.push(i);
        }
        return ticks;
    }, [stackedData]);

    /* ── pie data ── */
    const pieData = useMemo(() => {
        const counts = {
            Expert: 0,
            Advanced: 0,
            Intermediate: 0,
            Novice: 0,
            Beginner: 0,
        };

        filtered.forEach((entry) => {
            const level = classifyLevel(entry.averageScore);
            counts[level] += entry.employeesCount;
        });

        return [
            { name: 'Expert', value: counts.Expert, fill: LEVEL_COLORS.Expert },
            {
                name: 'Advanced',
                value: counts.Advanced,
                fill: LEVEL_COLORS.Advanced,
            },
            {
                name: 'Intermediate',
                value: counts.Intermediate,
                fill: LEVEL_COLORS.Intermediate,
            },
            { name: 'Novice', value: counts.Novice, fill: LEVEL_COLORS.Novice },
            {
                name: 'Beginner',
                value: counts.Beginner,
                fill: LEVEL_COLORS.Beginner,
            },
        ].filter((d) => d.value > 0);
    }, [filtered]);

    if (filtered.length === 0) return null;

    pieData.sort((a, b) => b.value - a.value);
    stackedData.sort((a, b) => a.competence.localeCompare(b.competence));

    return (
        <div className="grid grid-cols-2 xl:grid-cols-2 gap-8 w-full">
            {/* Chart 1 · Pie */}
            <Card className="flex-1 min-w-[95px] w-full overflow-hidden">
                <CardHeader className="items-center">
                    <CardTitle>Talent Maturity Distribution</CardTitle>
                    <CardDescription>
                        This chart visualizes the concentration of expertise
                        levels across the organization. It provides a snapshot
                        of workforce maturity, helping leadership align the
                        current talent pool with future business challenges.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={pieChartConfig}
                        className="mx-auto max-h-[500px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        formatter={(value, name, item) => (
                                            <div className="flex min-w-[150px] flex-col items-start text-xs text-muted-foreground">
                                                <div className="flex items-center justify-start gap-1 w-full p-0 m-0">
                                                    <span
                                                        className="h-2.5 w-1 shrink-0 rounded-[2px] mr-1"
                                                        style={
                                                            {
                                                                backgroundColor:
                                                                    pieChartConfig[
                                                                        name
                                                                    ].color,
                                                            } as React.CSSProperties
                                                        }
                                                    />
                                                    <span>
                                                        {
                                                            pieChartConfig[name]
                                                                .label
                                                        }
                                                    </span>
                                                    <span className="ml-auto flex items-center justify-end gap-0.5 font-mono font-medium text-foreground tabular-nums">
                                                        {formatNumber(
                                                            Number(value),
                                                            0,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    />
                                }
                            />
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius="90%"
                                innerRadius="50%"
                                cornerRadius={10}
                                paddingAngle={4}
                                strokeWidth={2}
                                startAngle={90}
                                endAngle={-270}
                                stroke="hsl(var(--background))"
                                label={({ payload, ...props }) => {
                                    return (
                                        <text
                                            cx={props.cx}
                                            cy={props.cy}
                                            x={props.x}
                                            y={props.y}
                                            textAnchor={props.textAnchor}
                                            dominantBaseline={
                                                props.dominantBaseline
                                            }
                                            fontWeight={500}
                                            fontSize={14}
                                            fill={payload.fill}
                                        >
                                            {payload.name}
                                        </text>
                                    );
                                }}
                            >
                                {pieData.map((entry) => (
                                    <Cell key={entry.name} fill={entry.fill} />
                                ))}
                                <LabelList
                                    dataKey="value"
                                    position="inside"
                                    className="fill-white font-semibold"
                                    fontSize={14}
                                />
                            </Pie>
                            <ChartLegend
                                className="mt-2 text-sm text-muted-foreground"
                                content={<ChartLegendContent nameKey="name" />}
                            />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Chart 2 · Stacked Bar */}
            <Card className="flex-1 min-w-[95px] w-full overflow-hidden">
                <CardHeader className="items-center">
                    <CardTitle>Cluster Level Distribution</CardTitle>
                    <CardDescription>
                        Proficiency level breakdown per competence showing
                        organizational maturity across skill domains. Stacked
                        layers represent employee counts per competence cluster
                        level.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={stackedChartConfig}
                        className="mx-auto w-full max-h-[500px]"
                    >
                        <BarChart
                            accessibilityLayer
                            data={stackedData}
                            barCategoryGap={'20%'}
                            margin={{ bottom: 10 }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="competence"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                height={50}
                                interval={0}
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
                                            y={y + 12}
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
                                                        x={x}
                                                        dy={
                                                            index === 0 ? 0 : 14
                                                        }
                                                        key={index}
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
                                domain={['dataMin', 'dataMax']}
                                ticks={yTicks}
                                axisLine={false}
                                tickLine={false}
                                tickMargin={8}
                            >
                                <Label
                                    value="Employees count"
                                    angle={-90}
                                    position="insideLeft"
                                    offset={15}
                                    style={{ textAnchor: 'middle' }}
                                    className="fill-muted-foreground text-xs"
                                />
                            </YAxis>
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent indicator="line" />
                                }
                            />
                            <ChartLegend
                                verticalAlign="bottom"
                                className="mb-4 text-sm text-muted-foreground"
                                content={<ChartLegendContent />}
                            />
                            {Object.keys(stackedChartConfig).map((key) => (
                                <Bar
                                    key={key}
                                    dataKey={key}
                                    stackId="stack"
                                    fill={LEVEL_COLORS[key]}
                                    radius={10}
                                >
                                    <LabelList
                                        dataKey={key}
                                        position="inside"
                                        offset={10}
                                        className="fill-white font-semibold"
                                        fontSize={14}
                                        formatter={(value: number) =>
                                            value > 0 ? value : ''
                                        }
                                    />
                                </Bar>
                            ))}
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
