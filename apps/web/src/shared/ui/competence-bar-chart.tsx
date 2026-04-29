'use client';

import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from 'recharts';

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
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@shared/components/ui/chart';
import { formatNumber } from '@shared/lib/utils/format-number';
import Decimal from 'decimal.js';

interface CompetenceBarChartData {
    id: number;
    competence: string;
    team: number;
    others: number;
    averageRating: number;
    color: string;
}

const COLOR_SHADES: Record<number, string> = {
    1: 'oklch(38% 0.189 293.745)', // 900
    2: 'oklch(43.2% 0.232 292.759)', // 800
    3: 'oklch(49.1% 0.27 292.581)', // 700
    4: 'oklch(54.1% 0.281 293.009)', // 600
    5: 'oklch(60.6% 0.25 292.717)', // 500
    6: 'oklch(70.2% 0.183 293.541)', // 400
    7: 'oklch(81.1% 0.111 293.571)', // 300
    8: 'oklch(89.4% 0.057 293.283)', // 200
    9: 'oklch(94.3% 0.029 294.588)', // 100
};

const generateColors = (n: number) => {
    const colors: string[] = [];
    if (n <= 5) {
        const shades = [3, 4, 5, 6, 7];
        for (let i = 0; i < n; i++) {
            colors.push(COLOR_SHADES[shades[i]]);
        }
    } else {
        for (let i = 0; i < n; i++) {
            const shade = (i % 9) + 1; // 1 to 9
            colors.push(COLOR_SHADES[shade]);
        }
    }
    return colors;
};

const chartConfig = {
    averageRating: {
        label: 'Average rating',
        color: 'var(--color-green-400)',
    },
    self: {
        label: 'Average self rating',
        color: 'var(--color-amber-400)',
    },
    team: {
        label: 'Average team rating',
        color: 'var(--color-blue-400)',
    },
    others: {
        label: 'Average others rating',
        color: 'var(--color-violet-400)',
    },
} satisfies ChartConfig;

export function CompetenceBarChart({
    reportAnalytics,
    title,
    description,
}: {
    reportAnalytics: StrategicReportAnalytics[];
    title?: string;
    description?: string;
}) {
    const data: CompetenceBarChartData[] = [];

    let hasTeamData = false;
    let hasOthersData = false;

    reportAnalytics?.forEach((a) => {
        if (a.deltaPercentageByTeam != null) hasTeamData = true;
        if (a.deltaPercentageByOther != null) hasOthersData = true;
        return data.push({
            id: a.competenceId ?? 0,
            competence: a.competenceTitle ?? 'Competence',
            team: a.percentageByTeam ?? 0,
            others: a.percentageByOther ?? 0,
            averageRating: new Decimal(a.percentageByTeam ?? 0)
                .add(a.percentageByOther ?? 0)
                .div(2)
                .toNumber(),
            color: '',
        });
    });

    data.sort((a, b) => b.averageRating - a.averageRating);
    const chartColors = generateColors(data.length);
    data.forEach((entry, index) => {
        entry.color = chartColors[index];
    });

    return (
        data &&
        data.length > 0 && (
            <Card className="flex-1 min-w-[95px] w-full overflow-hidden">
                <CardHeader className="items-center">
                    <CardTitle>
                        {title || 'Organizational Proficiency Benchmarks'}
                    </CardTitle>
                    <CardDescription>
                        {description ||
                            'Average competency scores calculated across the entire workforce. This chart establishes performance baselines for each domain, helping prioritize corporate training initiatives based on collective skill levels.'}
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
                            layout="vertical"
                            margin={{
                                left: 10,
                                bottom: 10,
                                right: 10,
                            }}
                            barCategoryGap={'10%'}
                        >
                            <XAxis
                                dataKey="averageRating"
                                type="number"
                                domain={[0, 100]}
                                ticks={[0, 25, 50, 75, 100]}
                                axisLine={true}
                                tickLine={false}
                                tickMargin={10}
                                tickFormatter={(value) =>
                                    `${formatNumber(value, 0)}%`
                                }
                            />
                            <YAxis dataKey="competence" type="category" hide />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        indicator="line"
                                        labelKey="competence"
                                        formatter={(value, name, item) => (
                                            <div className="flex min-w-[150px] flex-col items-start text-xs text-muted-foreground">
                                                <div className="text-foreground font-medium mb-1">
                                                    {item.payload.competence}
                                                </div>
                                                <div className="flex items-center justify-start gap-1 w-full p-0 m-0">
                                                    <span
                                                        className="h-2.5 w-1 shrink-0 rounded-[2px] bg-(--color-bg) mr-1"
                                                        style={{
                                                            backgroundColor:
                                                                item.payload
                                                                    .color ||
                                                                item.fill,
                                                        }}
                                                    />
                                                    <span>
                                                        {chartConfig[
                                                            name as keyof typeof chartConfig
                                                        ]?.label || name}
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
                                    />
                                }
                            />
                            <Bar dataKey="averageRating" radius={10}>
                                {(() => {
                                    return data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ));
                                })()}
                                <LabelList
                                    dataKey="competence"
                                    position="insideLeft"
                                    offset={10}
                                    className="fill-white font-semibold"
                                    fontSize={14}
                                />
                                <LabelList
                                    dataKey="averageRating"
                                    position="insideRight"
                                    offset={10}
                                    className="fill-white font-semibold"
                                    fontSize={14}
                                    formatter={(value: number) =>
                                        formatNumber(value) + ' %'
                                    }
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        )
    );
}
