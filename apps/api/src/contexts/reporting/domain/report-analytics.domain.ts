import { EntityType } from '@intra/shared-kernel';

export type ReportAnalyticsProps = {
    id?: number;
    reportId: number;
    entityType: EntityType;
    entityId?: number | null;
    entityTitle: string;
    averageBySelfAssessment?: number | null;
    averageByTeam?: number | null;
    averageByOther?: number | null;
    deltaBySelfAssessment?: number | null;
    deltaByTeam?: number | null;
    deltaByOther?: number | null;
    dimension?: string | null;
    createdAt?: Date;
};

export class ReportAnalyticsDomain {
    readonly id?: number;
    readonly reportId: number;
    readonly entityType: EntityType;
    readonly entityId?: number | null;
    readonly entityTitle: string;
    readonly averageBySelfAssessment?: number | null;
    readonly averageByTeam?: number | null;
    readonly averageByOther?: number | null;
    readonly deltaBySelfAssessment?: number | null;
    readonly deltaByTeam?: number | null;
    readonly deltaByOther?: number | null;
    readonly dimension?: string | null;
    readonly createdAt?: Date;

    private constructor(props: ReportAnalyticsProps) {
        this.id = props.id;
        this.reportId = props.reportId;
        this.entityType = props.entityType;
        this.entityId = props.entityId ?? null;
        this.entityTitle = props.entityTitle;
        this.averageBySelfAssessment = props.averageBySelfAssessment ?? null;
        this.averageByTeam = props.averageByTeam ?? null;
        this.averageByOther = props.averageByOther ?? null;
        this.deltaBySelfAssessment = props.deltaBySelfAssessment ?? null;
        this.deltaByTeam = props.deltaByTeam ?? null;
        this.deltaByOther = props.deltaByOther ?? null;
        this.dimension = props.dimension ?? null;
        this.createdAt = props.createdAt;
    }

    static create(props: ReportAnalyticsProps): ReportAnalyticsDomain {
        return new ReportAnalyticsDomain(props);
    }
}
