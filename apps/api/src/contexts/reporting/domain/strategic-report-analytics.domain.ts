import Decimal from 'decimal.js';

export type StrategicReportAnalyticsProps = {
    id?: number;
    strategicReportId: number;
    competenceId: number;
    competenceTitle: string;
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

export class StrategicReportAnalyticsDomain {
    readonly id?: number;
    readonly strategicReportId: number;
    readonly competenceId: number;
    readonly competenceTitle: string;
    readonly averageBySelfAssessment?: Decimal | null;
    readonly averageByTeam?: Decimal | null;
    readonly averageByOther?: Decimal | null;
    readonly percentageBySelfAssessment?: Decimal | null;
    readonly percentageByTeam?: Decimal | null;
    readonly percentageByOther?: Decimal | null;
    readonly deltaPercentageByTeam?: Decimal | null;
    readonly deltaPercentageByOther?: Decimal | null;
    readonly createdAt?: Date;

    private constructor(props: StrategicReportAnalyticsProps) {
        this.id = props.id;
        this.strategicReportId = props.strategicReportId;
        this.competenceId = props.competenceId;
        this.competenceTitle = props.competenceTitle;
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

    static create(
        props: StrategicReportAnalyticsProps,
    ): StrategicReportAnalyticsDomain {
        return new StrategicReportAnalyticsDomain(props);
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
