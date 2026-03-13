'use client';

import { LabelList, PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';

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
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@shared/components/ui/chart';

interface CompetenceRadialChartData {
    category: string;
    rating: number;
    fill: string;
}

interface CompetenceRadialChartsData {
    id: number;
    competence: string;
    ratings: CompetenceRadialChartData[];
}

const chartConfig = {
    rating: {
        label: 'Rating %',
    },
    self: {
        label: 'Self',
        // color: 'var(--color-slate-400)',
        color: 'var(--color-amber-400)',
    },
    team: {
        label: 'Team',
        // color: 'var(--color-slate-600)',
        color: 'var(--color-blue-400)',
    },
    others: {
        label: 'Others',
        // color: 'var(--color-slate-900)',
        color: 'var(--color-violet-400)',
    },
} satisfies ChartConfig;

export function CompetenciesRadialChartsGroup({
    reportAnalytics,
}: {
    reportAnalytics: ReportAnalytics[];
}) {
    const data: CompetenceRadialChartsData[] = [];

    const hasSelfData = reportAnalytics.some(
        (a) => a.percentageBySelfAssessment != null,
    );
    const hasTeamData = reportAnalytics.some((a) => a.percentageByTeam != null);
    const hasOthersData = reportAnalytics.some(
        (a) => a.percentageByOther != null,
    );

    reportAnalytics?.forEach((a) => {
        const ratings: CompetenceRadialChartData[] = [];

        if (hasSelfData) {
            ratings.push({
                category: 'self',
                rating: a.percentageBySelfAssessment ?? 0,
                fill: 'var(--color-self)',
            });
        }

        if (hasTeamData) {
            ratings.push({
                category: 'team',
                rating: a.percentageByTeam ?? 0,
                fill: 'var(--color-team)',
            });
        }

        if (hasOthersData) {
            ratings.push({
                category: 'others',
                rating: a.percentageByOther ?? 0,
                fill: 'var(--color-others)',
            });
        }

        return data.push({
            id: a.competenceId ?? 0,
            competence: a.competenceTitle ?? '',
            ratings,
        });
    });

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="items-center pb-0">
                <CardTitle>Individual Competence Profiles</CardTitle>
                <CardDescription>
                    A comparative analysis of skill proficiency levels for each
                    competence, segmented by rater category (self, team, and
                    others).
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row flex-wrap pb-0 justify-center gap-6 pt-0">
                {data.map((competenceData) => (
                    <div
                        key={competenceData.id}
                        className="flex flex-col items-center flex-1 min-w-[200px] max-w-[250px]"
                    >
                        <span className="text-base font-medium text-center mb-0 h-8 flex items-center line-clamp-2">
                            {competenceData.competence}
                        </span>
                        <ChartContainer
                            config={chartConfig}
                            className="w-full aspect-square"
                        >
                            <RadialBarChart
                                data={competenceData.ratings}
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
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
