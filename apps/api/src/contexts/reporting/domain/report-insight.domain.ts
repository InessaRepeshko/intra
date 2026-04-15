import { EntityType, InsightType } from '@intra/shared-kernel';
import Decimal from 'decimal.js';

export type ReportInsightProps = {
    id?: number;
    reportId: number;
    insightType: InsightType;
    entityType: EntityType;
    questionId: number | null;
    questionTitle: string | null;
    competenceId: number | null;
    competenceTitle: string | null;
    averageScore?: Decimal.Value | null;
    averageRating?: Decimal.Value | null;
    averageDelta?: Decimal.Value | null;
    createdAt?: Date;
};

export class ReportInsightDomain {
    readonly id?: number;
    readonly reportId: number;
    readonly insightType: InsightType;
    readonly entityType: EntityType;
    readonly questionId: number | null;
    readonly questionTitle: string | null;
    readonly competenceId: number | null;
    readonly competenceTitle: string | null;
    readonly averageScore?: Decimal | null;
    readonly averageRating?: Decimal | null;
    readonly averageDelta?: Decimal | null;
    readonly createdAt?: Date;

    private constructor(props: ReportInsightProps) {
        this.id = props.id;
        this.reportId = props.reportId;
        this.insightType = props.insightType;
        this.entityType = props.entityType;
        this.questionId = props.questionId ?? null;
        this.questionTitle = props.questionTitle ?? null;
        this.competenceId = props.competenceId ?? null;
        this.competenceTitle = props.competenceTitle ?? null;
        this.averageScore = this.toDecimalOrNull(props.averageScore);
        this.averageRating = this.toDecimalOrNull(props.averageRating);
        this.averageDelta = this.toDecimalOrNull(props.averageDelta);
        this.createdAt = props.createdAt;
    }

    static create(props: ReportInsightProps): ReportInsightDomain {
        return new ReportInsightDomain(props);
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
