import { CycleStage } from '@entities/feedback360/cycle/model/types';
import {
    ResponseStatus,
    ReviewStage,
} from '@entities/feedback360/review/model/types';
import { IdentityStatus } from '@entities/identity/user/model/types';
import { QuestionTemplateStatus } from '@entities/library/question-template/model/types';
import { Badge } from '@shared/components/ui/badge';
import { cn } from '@shared/lib/utils/cn';

type StatusVariant =
    | 'default'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'secondary'
    | 'outline';

const cycleStageMap: Record<
    CycleStage,
    { label: string; variant: StatusVariant }
> = {
    [CycleStage.NEW]: { label: 'New', variant: 'default' },
    [CycleStage.ACTIVE]: { label: 'Active', variant: 'warning' },
    [CycleStage.FINISHED]: { label: 'Finished', variant: 'secondary' },
    [CycleStage.PREPARING_REPORT]: {
        label: 'Preparing Report',
        variant: 'secondary',
    },
    [CycleStage.PUBLISHED]: { label: 'Published', variant: 'success' },
    [CycleStage.CANCELED]: { label: 'Cancelled', variant: 'destructive' },
    [CycleStage.ARCHIVED]: { label: 'Archived', variant: 'secondary' },
};

const reviewStageMap: Record<
    ReviewStage,
    { label: string; variant: StatusVariant }
> = {
    [ReviewStage.CANCELED]: { label: 'Cancelled', variant: 'destructive' },
    [ReviewStage.NEW]: {
        label: 'New',
        variant: 'default',
    },
    [ReviewStage.SELF_ASSESSMENT]: {
        label: 'Self Assessment',
        variant: 'warning',
    },
    [ReviewStage.WAITING_TO_START]: {
        label: 'Waiting to Start',
        variant: 'secondary',
    },
    [ReviewStage.IN_PROGRESS]: {
        label: 'Collecting Responses',
        variant: 'warning',
    },
    [ReviewStage.FINISHED]: { label: 'Completed', variant: 'secondary' },
    [ReviewStage.PREPARING_REPORT]: {
        label: 'Preparing Report',
        variant: 'secondary',
    },
    [ReviewStage.PROCESSING_BY_HR]: {
        label: 'Processing by HR',
        variant: 'success',
    },
    [ReviewStage.PUBLISHED]: { label: 'Ready to Review', variant: 'success' },
    [ReviewStage.ANALYSIS]: { label: 'Analysis', variant: 'success' },
    [ReviewStage.ARCHIVED]: { label: 'Archived', variant: 'secondary' },
};

const responseStatusMap: Record<
    ResponseStatus,
    { label: string; variant: StatusVariant }
> = {
    [ResponseStatus.PENDING]: { label: 'Pending', variant: 'default' },
    [ResponseStatus.IN_PROGRESS]: { label: 'In Progress', variant: 'warning' },
    [ResponseStatus.COMPLETED]: { label: 'Completed', variant: 'success' },
    [ResponseStatus.CANCELED]: { label: 'Canceled', variant: 'destructive' },
};

const identityStatusMap: Record<
    IdentityStatus,
    { label: string; variant: StatusVariant }
> = {
    [IdentityStatus.ACTIVE]: { label: 'Active', variant: 'success' },
    [IdentityStatus.INACTIVE]: { label: 'Inactive', variant: 'secondary' },
};

const questionTemplateStatusMap: Record<
    QuestionTemplateStatus,
    { label: string; variant: StatusVariant }
> = {
    [QuestionTemplateStatus.ACTIVE]: { label: 'Active', variant: 'success' },
    [QuestionTemplateStatus.ARCHIVE]: {
        label: 'Archived',
        variant: 'secondary',
    },
};

const variantStyles: Record<StatusVariant, string> = {
    default: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning-foreground border-warning/20',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
    secondary: 'bg-secondary text-secondary-foreground border-border',
    outline: 'bg-transparent text-foreground border-border',
};

interface StatusBadgeProps {
    status:
        | CycleStage
        | ReviewStage
        | ResponseStatus
        | IdentityStatus
        | QuestionTemplateStatus;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    let config: { label: string; variant: StatusVariant } | undefined;

    if (status in cycleStageMap) config = cycleStageMap[status as CycleStage];
    else if (status in reviewStageMap)
        config = reviewStageMap[status as ReviewStage];
    else if (status in responseStatusMap)
        config = responseStatusMap[status as ResponseStatus];
    else if (status in identityStatusMap)
        config = identityStatusMap[status as IdentityStatus];
    else if (status in questionTemplateStatusMap)
        config = questionTemplateStatusMap[status as QuestionTemplateStatus];

    if (!config) return <Badge variant="outline">{status}</Badge>;

    return (
        <Badge
            variant="outline"
            className={cn(
                'font-medium text-xs border',
                variantStyles[config.variant],
                className,
            )}
        >
            {config.label}
        </Badge>
    );
}
