import { InsightType } from '@intra/shared-kernel';
import Decimal from 'decimal.js';

export type StrategicReportInsightProps = {
    id?: number;
    strategicReportId: number;
    insightType: InsightType;
    competenceId: number;
    competenceTitle: string;
    averageScore?: Decimal.Value | null;
    averageRating?: Decimal.Value | null;
    averageDelta?: Decimal.Value | null;
    createdAt?: Date;
};

export class StrategicReportInsightDomain {
    readonly id?: number;
    readonly strategicReportId: number;
    readonly insightType: InsightType;
    readonly competenceId: number;
    readonly competenceTitle: string;
    readonly averageScore?: Decimal | null;
    readonly averageRating?: Decimal | null;
    readonly averageDelta?: Decimal | null;
    readonly createdAt?: Date;

    private constructor(props: StrategicReportInsightProps) {
        this.id = props.id;
        this.strategicReportId = props.strategicReportId;
        this.insightType = props.insightType;
        this.competenceId = props.competenceId;
        this.competenceTitle = props.competenceTitle;
        this.averageScore = this.toDecimalOrNull(props.averageScore);
        this.averageRating = this.toDecimalOrNull(props.averageRating);
        this.averageDelta = this.toDecimalOrNull(props.averageDelta);
        this.createdAt = props.createdAt;
    }

    static create(
        props: StrategicReportInsightProps,
    ): StrategicReportInsightDomain {
        return new StrategicReportInsightDomain(props);
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
