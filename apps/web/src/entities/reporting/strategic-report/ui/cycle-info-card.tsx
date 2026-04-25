import { Cycle } from '@entities/feedback360/cycle/model/mappers';
import { Card } from '@shared/components/ui/card';
import { format } from 'date-fns';
import { Calendar, HatGlasses, RefreshCcw } from 'lucide-react';

export function CycleInfoCard({ cycle }: { cycle: Cycle }) {
    if (!cycle) {
        return <span className="text-muted-foreground">None</span>;
    }

    return (
        <Card className="flex flex-col sm:flex-row sm:flex-nowrap items-center text-center sm:text-left gap-4 p-4 w-full max-w-[500px]">
            <div className="flex flex-col gap-2 flex-1 min-w-0 justify-start">
                <h3 className="flex flex-wrap items-center justify-center sm:justify-start gap-x-1 text-lg">
                    <RefreshCcw className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-medium text-foreground break-words">
                        Cycle Overview
                    </span>
                </h3>

                {cycle.title && (
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 mt-0.5">
                        <span className="font-semibold whitespace-pre-wrap max-w-full text-foreground border rounded-lg py-0.5 px-2 bg-lime-300/20 border-lime-500">
                            {cycle.title}
                        </span>
                    </div>
                )}

                {cycle.description && (
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2">
                        <span className="whitespace-pre-wrap max-w-full text-foreground text-sm">
                            {cycle.description}
                        </span>
                    </div>
                )}

                {cycle.startDate && cycle.endDate && (
                    <div className="flex items-center justify-center sm:justify-start gap-x-2 text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span className="whitespace-pre-wrap max-w-full text-sm text-foreground">
                            {format(cycle.startDate, 'MMM dd, yyyy')}
                            {` — `}
                            {format(cycle.endDate, 'MMM dd, yyyy')}
                        </span>
                    </div>
                )}

                {cycle.minRespondentsThreshold && (
                    <div className="flex items-center justify-center sm:justify-start gap-x-2 text-muted-foreground">
                        <HatGlasses className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-sm text-lg whitespace-pre-wrap max-w-full flex flex-row gap-x-1">
                            <span className="text-muted-foreground">Anonymity threshold:</span>
                            <span className="text-foreground font-medium">{cycle.minRespondentsThreshold}</span>
                            <span className="text-muted-foreground">answers</span>
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
}
