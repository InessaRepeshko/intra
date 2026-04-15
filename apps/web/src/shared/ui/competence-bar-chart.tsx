"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, LabelList, Cell } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@shared/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@shared/components/ui/chart"
import { StrategicReportAnalytics } from "@entities/reporting/strategic-report/model/mappers"
import Decimal from "decimal.js"
import { formatNumber } from "@shared/lib/utils/format-number"

interface CompetenceBarChartData {
    id: number;
    competence: string;
    team: number;
    others: number;
    averageRating: number;
}

const BLUE_SHADES: Record<number, string> = {
    1: '#dbeafe', // 100
    2: '#bfdbfe', // 200
    3: '#93c5fd', // 300
    4: '#60a5fa', // 400
    5: '#3b82f6', // 500
    6: '#2563eb', // 600
    7: '#1d4ed8', // 700
    8: '#1e40af', // 800
    9: '#1e3a8a', // 900
};

const generateColors = (n: number) => {
    const colors: string[] = [];
    if (n <= 5) {
        const shades = [3, 4, 5, 6, 7];
        for (let i = 0; i < n; i++) {
            colors.push(BLUE_SHADES[shades[i]]);
        }
    } else {
        for (let i = 0; i < n; i++) {
            const shade = (i % 9) + 1; // 1 to 9
            colors.push(BLUE_SHADES[shade]);
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
        label: 'Average self-rating',
        color: 'var(--color-amber-400)',
    },
    team: {
        label: 'Average team-rating',
        color: 'var(--color-blue-400)',
    },
    others: {
        label: 'Average others-rating',
        color: 'var(--color-violet-400)',
    },
} satisfies ChartConfig;

export function CompetenceBarChart({
    reportAnalytics,
}: {
    reportAnalytics: StrategicReportAnalytics[];
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
            averageRating: (new Decimal(a.percentageByTeam ?? 0).add(a.percentageByOther ?? 0)).div(2).toNumber()
        });
    });

    return (
        data && data.length > 0 && (
        <Card className="flex-1 min-w-[95px] w-full overflow-hidden">
            <CardHeader className="items-center">
                <CardTitle>Company-wide Competency Ratings</CardTitle>
                <CardDescription>Average scores across all employees</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="mx-auto max-h-[500px]">
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
                        />
                        <YAxis
                            dataKey="competence"
                            type="category"
                            hide
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="averageRating" radius={10}>
                                {(() => {
                                    const chartColors = generateColors(data.length);
                                    return data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={chartColors[index]} />
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
                                    position="right"
                                    offset={10}
                                    className="fill-foreground font-semibold"
                                    fontSize={14}
                                    formatter={(value: number) => formatNumber(value) + ' %'}
                                />                        
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
    )
}
