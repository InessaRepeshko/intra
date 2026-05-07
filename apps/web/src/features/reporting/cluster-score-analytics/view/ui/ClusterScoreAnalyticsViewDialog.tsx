'use client';

import { Eye, X } from 'lucide-react';

import type { ClusterScoreAnalytics } from '@entities/reporting/cluster-score-analytics/model/mappers';
import { ClusterBadge } from '@entities/reporting/cluster-score-analytics/ui/cluster-badge';
import { Button } from '@shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@shared/components/ui/dialog';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { cn } from '@shared/lib/utils/cn';
import { formatNumber } from '@shared/lib/utils/format-number';

interface ClusterScoreAnalyticsViewDialogProps {
    clusterScoreAnalytics: ClusterScoreAnalytics | null;
    clusterScoreTitles: Record<
        number,
        { title: string; description: string; competenceId: number }
    >;
    competenceTitles: Record<
        number,
        { title: string; code: string | null; description: string | null }
    >;
    cycleTitles: Record<number, string>;
    onClose: () => void;
}

const inputClassName =
    'border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground rounded-xl';

export function ClusterScoreAnalyticsViewDialog({
    clusterScoreAnalytics,
    clusterScoreTitles,
    competenceTitles,
    cycleTitles,
    onClose,
}: ClusterScoreAnalyticsViewDialogProps) {
    const isOpen = clusterScoreAnalytics != null;

    const handleOpenChange = (next: boolean) => {
        if (!next) onClose();
    };

    const titleText = 'Cluster Score Analytics Details';

    const cluster = clusterScoreAnalytics?.clusterId
        ? clusterScoreTitles[clusterScoreAnalytics.clusterId]
        : undefined;
    const competence =
        cluster?.competenceId !== undefined
            ? competenceTitles[cluster.competenceId]
            : undefined;
    const cycleTitle = clusterScoreAnalytics?.cycleId
        ? cycleTitles[clusterScoreAnalytics.cycleId]
        : undefined;

    const competenceLabel = competence
        ? competence.code
            ? `${competence.title}, ${competence.code}`
            : competence.title
        : '';

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-0 gap-0"
            >
                <DialogTitle className="sr-only">{titleText}</DialogTitle>
                <div className="flex flex-col">
                    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background rounded-t-xl px-6 py-4 flex-wrap gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                                <Eye className="h-5 w-5" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-lg font-semibold tracking-tight text-foreground truncate">
                                    {titleText}
                                </p>
                                {clusterScoreAnalytics && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                                        <span>#{clusterScoreAnalytics.id}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </header>

                    <div className="flex flex-col gap-6 p-6">
                        <Card className="border-border bg-card">
                            <CardHeader>
                                <CardTitle className="text-base text-foreground">
                                    Context
                                </CardTitle>
                                <CardDescription>
                                    Competence, cluster and cycle this record
                                    belongs to.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="competence">
                                        Competence
                                    </Label>
                                    <Input
                                        id="competence"
                                        value={competenceLabel}
                                        readOnly
                                        disabled
                                        className={inputClassName}
                                    />
                                    {competence?.description && (
                                        <p className="text-xs text-muted-foreground">
                                            {competence.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Cluster</Label>
                                    <div
                                        className={cn(
                                            'flex items-center gap-2 px-3 py-2 min-h-9',
                                            inputClassName,
                                        )}
                                    >
                                        {cluster?.title ? (
                                            <ClusterBadge
                                                label={cluster.title}
                                            />
                                        ) : (
                                            <span className="text-muted-foreground text-sm">
                                                None
                                            </span>
                                        )}
                                        {cluster?.description && (
                                            <span className="text-xs text-muted-foreground truncate">
                                                {cluster.description}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="cycle">Cycle</Label>
                                    <Input
                                        id="cycle"
                                        value={cycleTitle ?? ''}
                                        readOnly
                                        disabled
                                        className={inputClassName}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border bg-card">
                            <CardHeader>
                                <CardTitle className="text-base text-foreground">
                                    Score Range
                                </CardTitle>
                                <CardDescription>
                                    Numeric bounds (0–5) for which this cluster
                                    is assigned.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="lowerBound">
                                        Lower Bound
                                    </Label>
                                    <Input
                                        id="lowerBound"
                                        value={
                                            clusterScoreAnalytics?.lowerBound ??
                                            ''
                                        }
                                        readOnly
                                        disabled
                                        className={inputClassName}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="upperBound">
                                        Upper Bound
                                    </Label>
                                    <Input
                                        id="upperBound"
                                        value={
                                            clusterScoreAnalytics?.upperBound ??
                                            ''
                                        }
                                        readOnly
                                        disabled
                                        className={inputClassName}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border bg-card">
                            <CardHeader>
                                <CardTitle className="text-base text-foreground">
                                    Scores
                                </CardTitle>
                                <CardDescription>
                                    Lowest, highest and average scores
                                    aggregated for this cluster.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="minScore">
                                        Lowest Score
                                    </Label>
                                    <Input
                                        id="minScore"
                                        value={formatNumber(
                                            clusterScoreAnalytics?.minScore ??
                                                0,
                                            2,
                                        )}
                                        readOnly
                                        disabled
                                        className={inputClassName}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="maxScore">
                                        Highest Score
                                    </Label>
                                    <Input
                                        id="maxScore"
                                        value={formatNumber(
                                            clusterScoreAnalytics?.maxScore ??
                                                0,
                                            2,
                                        )}
                                        readOnly
                                        disabled
                                        className={inputClassName}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="averageScore">
                                        Average Score
                                    </Label>
                                    <Input
                                        id="averageScore"
                                        value={formatNumber(
                                            clusterScoreAnalytics?.averageScore ??
                                                0,
                                            2,
                                        )}
                                        readOnly
                                        disabled
                                        className={inputClassName}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border bg-card">
                            <CardHeader>
                                <CardTitle className="text-base text-foreground">
                                    Ratees
                                </CardTitle>
                                <CardDescription>
                                    Number of rated employees and their density
                                    within the cluster bounds.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="employeesCount">
                                        Number of Ratees
                                    </Label>
                                    <Input
                                        id="employeesCount"
                                        value={
                                            clusterScoreAnalytics?.employeesCount ??
                                            ''
                                        }
                                        readOnly
                                        disabled
                                        className={inputClassName}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="employeeDensity">
                                        Ratee Density (%)
                                    </Label>
                                    <Input
                                        id="employeeDensity"
                                        value={formatNumber(
                                            (clusterScoreAnalytics?.employeeDensity ??
                                                0) * 100,
                                            2,
                                        )}
                                        readOnly
                                        disabled
                                        className={inputClassName}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-wrap justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="border-border text-foreground hover:bg-secondary rounded-xl"
                                onClick={onClose}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
