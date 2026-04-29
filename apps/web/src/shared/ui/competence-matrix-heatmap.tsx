'use client';

import { useMemo } from 'react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@shared/components/ui/tooltip';
import { formatNumber } from '@shared/lib/utils/format-number';
import { Percent } from 'lucide-react';

/* ─── colour scale helpers ─── */
const HEATMAP_PALETTE = [
    'oklch(95.6% 0.045 203.388)', // 100
    'oklch(90.1% 0.058 230.902)', // 200
    'oklch(82.8% 0.111 230.318)', // 300
    'oklch(74.6% 0.16 232.661)', // 400
    'oklch(68.5% 0.169 237.323)', // 500
    'oklch(58.8% 0.158 241.966)', // 600
    'oklch(50% 0.134 242.749)', // 700
    'oklch(44.3% 0.11 240.79)', // 800
    'oklch(39.1% 0.09 240.876)', // 900
];

function getHeatColor(value: number, min: number, max: number): string {
    if (max === min) return HEATMAP_PALETTE[HEATMAP_PALETTE.length - 1];
    const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const index = Math.round(ratio * (HEATMAP_PALETTE.length - 1));
    return HEATMAP_PALETTE[index];
}

function getTextColor(value: number, min: number, max: number): string {
    if (max === min) return '#fff';
    const ratio = (value - min) / (max - min);
    return ratio > 0.5 ? '#fff' : 'hsl(var(--foreground))';
}

export interface TeamCompetenceRating {
    teamTitle: string;
    competenceTitle: string;
    avgRating: number;
}

interface CompetenceMatrixHeatmapProps {
    teamCompetenceMatrix: TeamCompetenceRating[];
}

interface HeatmapCell {
    teamTitle: string;
    competenceTitle: string;
    avgRating: number;
}

export function CompetenceMatrixHeatmap({
    teamCompetenceMatrix,
}: CompetenceMatrixHeatmapProps) {
    /* build matrix */
    const { teams, competences, matrix, globalMin, globalMax } = useMemo(() => {
        if (teamCompetenceMatrix.length === 0) {
            return {
                teams: [],
                competences: [],
                matrix: [],
                globalMin: 0,
                globalMax: 100,
            };
        }

        const teamSet = new Set<string>();
        const compSet = new Set<string>();
        teamCompetenceMatrix.forEach((item) => {
            teamSet.add(item.teamTitle);
            compSet.add(item.competenceTitle);
        });

        const teamList = Array.from(teamSet).sort();
        const compList = Array.from(compSet).sort();

        // Build lookup map: `team|competence` → avgRating
        const lookup: Record<string, number> = {};
        teamCompetenceMatrix.forEach((item) => {
            const key = `${item.teamTitle}|${item.competenceTitle}`;
            lookup[key] = item.avgRating;
        });

        let gMin = 100;
        let gMax = 0;

        const cells: HeatmapCell[][] = teamList.map((team) =>
            compList.map((comp) => {
                const avg = lookup[`${team}|${comp}`] ?? 0;
                if (avg > 0 && avg < gMin) gMin = avg;
                if (avg > gMax) gMax = avg;
                return {
                    teamTitle: team,
                    competenceTitle: comp,
                    avgRating: avg,
                };
            }),
        );

        return {
            teams: teamList,
            competences: compList,
            matrix: cells,
            globalMin: gMin,
            globalMax: gMax,
        };
    }, [teamCompetenceMatrix]);

    if (
        teamCompetenceMatrix.length === 0 ||
        teams.length === 0 ||
        competences.length === 0
    )
        return null;

    return (
        <Card className="flex-1 min-w-[95px] w-full overflow-hidden">
            <CardHeader className="items-center">
                <CardTitle>Competence Matrix Heatmap</CardTitle>
                <CardDescription>
                    Teams mapped against competencies to identify centres of
                    expertise and areas that may need reinforcement. Darker
                    cells indicate higher average ratings.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TooltipProvider delayDuration={150}>
                    <div className="overflow-x-auto overflow-y-auto max-h-[800px]">
                        <table className="w-full border-separate border-spacing-1">
                            <thead>
                                <tr>
                                    <th className="sticky left-0 z-10 bg-background w-[100px] min-w-[50px] text-right text-sm font-semibold text-foreground p-2 pr-4">
                                        Team / Competence
                                    </th>
                                    {competences.map((comp) => (
                                        <th
                                            key={comp}
                                            className="text-center text-sm font-semibold text-foreground p-2 w-[200px] min-w-[50px] leading-tight"
                                        >
                                            {comp}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {matrix.map((row, ri) => (
                                    <tr key={teams[ri]}>
                                        <td className="sticky left-0 z-10 bg-background text-sm font-semibold p-2 pr-4 whitespace-nowrap text-foreground text-right">
                                            {teams[ri]}
                                        </td>
                                        {row.map((cell, ci) => (
                                            <td
                                                key={`${ri}-${ci}`}
                                                className="p-0"
                                            >
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            className="flex items-center justify-center rounded-md h-20 w-full font-mono text-sm font-semibold transition-transform hover:scale-105 cursor-default px-1"
                                                            style={{
                                                                backgroundColor:
                                                                    getHeatColor(
                                                                        cell.avgRating,
                                                                        globalMin,
                                                                        globalMax,
                                                                    ),
                                                                color: getTextColor(
                                                                    cell.avgRating,
                                                                    globalMin,
                                                                    globalMax,
                                                                ),
                                                            }}
                                                        >
                                                            {formatNumber(
                                                                cell.avgRating,
                                                            )}
                                                            <Percent className="shrink-0 w-3.5 h-3.5" />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="text-xs bg-white shadow-xl">
                                                        <p className="text-primary">
                                                            <span className="text-muted-foreground">
                                                                Team:{' '}
                                                            </span>{' '}
                                                            <span className="font-semibold">
                                                                {cell.teamTitle}
                                                            </span>
                                                        </p>
                                                        <p className="text-primary">
                                                            <span className="text-muted-foreground">
                                                                Competence:{' '}
                                                            </span>{' '}
                                                            <span className="font-semibold">
                                                                {
                                                                    cell.competenceTitle
                                                                }
                                                            </span>
                                                        </p>
                                                        <p className="mt-1 text-primary w-full flex">
                                                            <span className="text-muted-foreground">
                                                                Average
                                                                rating{' '}
                                                            </span>{' '}
                                                            <span className="font-mono ml-auto">
                                                                {formatNumber(
                                                                    cell.avgRating,
                                                                )}
                                                                %
                                                            </span>
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Legend colour scale */}
                    <div className="mt-4 mb-6 flex items-center justify-center gap-2">
                        <span className="text-xs text-muted-foreground">
                            Low
                        </span>
                        <div className="flex h-3 w-40 rounded-full overflow-hidden">
                            {HEATMAP_PALETTE.map((color, i) => (
                                <div
                                    key={i}
                                    className="flex-1"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                            High
                        </span>
                    </div>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
}
