import { EntityType } from '@intra/shared-kernel';
import Decimal from 'decimal.js';

export type ReportAnalyticsProps = {
    id?: number;
    reportId: number;
    entityType: EntityType;
    questionId: number | null;
    questionTitle: string | null;
    competenceId: number | null;
    competenceTitle: string | null;
    averageBySelfAssessment?: Decimal.Value | null;
    averageByTeam?: Decimal.Value | null;
    averageByOther?: Decimal.Value | null;
    percentageBySelfAssessment?: Decimal.Value | null;
    percentageByTeam?: Decimal.Value | null;
    percentageByOther?: Decimal.Value | null;
    deltaPercentageByTeam?: Decimal.Value | null;
    deltaPercentageByOther?: Decimal.Value | null;
    createdAt?: Date;
};

export class ReportAnalyticsDomain {
    readonly id?: number;
    readonly reportId: number;
    readonly entityType: EntityType;
    readonly questionId: number | null;
    readonly questionTitle: string | null;
    readonly competenceId: number | null;
    readonly competenceTitle: string | null;
    readonly averageBySelfAssessment?: Decimal | null;
    readonly averageByTeam?: Decimal | null;
    readonly averageByOther?: Decimal | null;
    readonly percentageBySelfAssessment?: Decimal | null;
    readonly percentageByTeam?: Decimal | null;
    readonly percentageByOther?: Decimal | null;
    readonly deltaPercentageByTeam?: Decimal | null;
    readonly deltaPercentageByOther?: Decimal | null;
    readonly createdAt?: Date;

    private constructor(props: ReportAnalyticsProps) {
        this.id = props.id;
        this.reportId = props.reportId;
        this.entityType = props.entityType;
        this.questionId = props.questionId ?? null;
        this.questionTitle = props.questionTitle ?? null;
        this.competenceId = props.competenceId ?? null;
        this.competenceTitle = props.competenceTitle ?? null;
        this.averageBySelfAssessment = this.toDecimalOrNull(
            props.averageBySelfAssessment,
        );
        this.averageByTeam = this.toDecimalOrNull(props.averageByTeam);
        this.averageByOther = this.toDecimalOrNull(props.averageByOther);
        this.percentageBySelfAssessment = this.toDecimalOrNull(
            props.percentageBySelfAssessment,
        );
        this.percentageByTeam = this.toDecimalOrNull(props.percentageByTeam);
        this.percentageByOther = this.toDecimalOrNull(props.percentageByOther);
        this.deltaPercentageByTeam = this.toDecimalOrNull(
            props.deltaPercentageByTeam,
        );
        this.deltaPercentageByOther = this.toDecimalOrNull(
            props.deltaPercentageByOther,
        );
        this.createdAt = props.createdAt;
    }

    static create(props: ReportAnalyticsProps): ReportAnalyticsDomain {
        return new ReportAnalyticsDomain(props);
    }

    private toDecimalOrNull(
        value: Decimal.Value | null | undefined,
    ): Decimal | null {
        if (value === null || value === undefined) {
            return null;
        }
        return new Decimal(value);
    }
}
