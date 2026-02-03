import { EntityType } from '@intra/shared-kernel';

export type ReportAnalyticsProps = {
    id?: number;
    reportId: number;
    entityType: EntityType;
    questionId: number | null;
    questionTitle: string | null;
    clusterId: number | null;
    clusterTitle: string | null;
    competenceId: number | null;
    competenceTitle: string | null;
    averageBySelfAssessment?: number | null;
    averageByTeam?: number | null;
    averageByOther?: number | null;
    deltaBySelfAssessment?: number | null;
    deltaByTeam?: number | null;
    deltaByOther?: number | null;
    createdAt?: Date;
};

export class ReportAnalyticsDomain {
    readonly id?: number;
    readonly reportId: number;
    readonly entityType: EntityType;
    readonly questionId: number | null;
    readonly questionTitle: string | null;
    readonly clusterId: number | null;
    readonly clusterTitle: string | null;
    readonly competenceId: number | null;
    readonly competenceTitle: string | null;
    readonly averageBySelfAssessment?: number | null;
    readonly averageByTeam?: number | null;
    readonly averageByOther?: number | null;
    readonly deltaBySelfAssessment?: number | null;
    readonly deltaByTeam?: number | null;
    readonly deltaByOther?: number | null;
    readonly createdAt?: Date;

    private constructor(props: ReportAnalyticsProps) {
        this.id = props.id;
        this.reportId = props.reportId;
        this.entityType = props.entityType;
        this.questionId = props.questionId ?? null;
        this.questionTitle = props.questionTitle ?? null;
        this.clusterId = props.clusterId ?? null;
        this.clusterTitle = props.clusterTitle ?? null;
        this.competenceId = props.competenceId ?? null;
        this.competenceTitle = props.competenceTitle ?? null;
        this.averageBySelfAssessment = props.averageBySelfAssessment ?? null;
        this.averageByTeam = props.averageByTeam ?? null;
        this.averageByOther = props.averageByOther ?? null;
        this.deltaBySelfAssessment = props.deltaBySelfAssessment ?? null;
        this.deltaByTeam = props.deltaByTeam ?? null;
        this.deltaByOther = props.deltaByOther ?? null;
        this.createdAt = props.createdAt;
    }

    static create(props: ReportAnalyticsProps): ReportAnalyticsDomain {
        return new ReportAnalyticsDomain(props);
    }
}
