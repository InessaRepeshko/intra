import Decimal from 'decimal.js';
import { StrategicReportAnalyticsDomain } from './strategic-report-analytics.domain';

export type StrategicReportProps = {
    id?: number;
    cycleId: number;
    cycleTitle: string;
    rateeCount: number;
    respondentCount: number;
    answerCount: number;
    reviewerCount: number;
    teamCount: number;
    positionCount: number;
    competenceCount: number;
    questionCount: number;
    turnoutPctOfRatees?: Decimal.Value | null;
    turnoutPctOfRespondents?: Decimal.Value | null;
    competenceGeneralAvgSelf?: Decimal.Value | null;
    competenceGeneralAvgTeam?: Decimal.Value | null;
    competenceGeneralAvgOther?: Decimal.Value | null;
    competenceGeneralPctSelf?: Decimal.Value | null;
    competenceGeneralPctTeam?: Decimal.Value | null;
    competenceGeneralPctOther?: Decimal.Value | null;
    competenceGeneralDeltaTeam?: Decimal.Value | null;
    competenceGeneralDeltaOther?: Decimal.Value | null;
    createdAt?: Date;
    analytics?: StrategicReportAnalyticsDomain[];
};

export class StrategicReportDomain {
    readonly id?: number;
    readonly cycleId: number;
    readonly cycleTitle: string;
    readonly rateeCount: number;
    readonly respondentCount: number;
    readonly answerCount: number;
    readonly reviewerCount: number;
    readonly teamCount: number;
    readonly positionCount: number;
    readonly competenceCount: number;
    readonly questionCount: number;
    readonly turnoutPctOfRatees?: Decimal | null;
    readonly turnoutPctOfRespondents?: Decimal | null;
    readonly competenceGeneralAvgSelf?: Decimal | null;
    readonly competenceGeneralAvgTeam?: Decimal | null;
    readonly competenceGeneralAvgOther?: Decimal | null;
    readonly competenceGeneralPctSelf?: Decimal | null;
    readonly competenceGeneralPctTeam?: Decimal | null;
    readonly competenceGeneralPctOther?: Decimal | null;
    readonly competenceGeneralDeltaTeam?: Decimal | null;
    readonly competenceGeneralDeltaOther?: Decimal | null;
    readonly createdAt?: Date;
    readonly analytics?: StrategicReportAnalyticsDomain[];

    private constructor(props: StrategicReportProps) {
        this.id = props.id;
        this.cycleId = props.cycleId;
        this.cycleTitle = props.cycleTitle;
        this.rateeCount = props.rateeCount;
        this.respondentCount = props.respondentCount;
        this.answerCount = props.answerCount;
        this.reviewerCount = props.reviewerCount;
        this.teamCount = props.teamCount;
        this.positionCount = props.positionCount;
        this.competenceCount = props.competenceCount;
        this.questionCount = props.questionCount;
        this.turnoutPctOfRatees = this.toDecimalOrNull(
            props.turnoutPctOfRatees,
        );
        this.turnoutPctOfRespondents = this.toDecimalOrNull(
            props.turnoutPctOfRespondents,
        );
        this.competenceGeneralAvgSelf = this.toDecimalOrNull(
            props.competenceGeneralAvgSelf,
        );
        this.competenceGeneralAvgTeam = this.toDecimalOrNull(
            props.competenceGeneralAvgTeam,
        );
        this.competenceGeneralAvgOther = this.toDecimalOrNull(
            props.competenceGeneralAvgOther,
        );
        this.competenceGeneralPctSelf = this.toDecimalOrNull(
            props.competenceGeneralPctSelf,
        );
        this.competenceGeneralPctTeam = this.toDecimalOrNull(
            props.competenceGeneralPctTeam,
        );
        this.competenceGeneralPctOther = this.toDecimalOrNull(
            props.competenceGeneralPctOther,
        );
        this.competenceGeneralDeltaTeam = this.toDecimalOrNull(
            props.competenceGeneralDeltaTeam,
        );
        this.competenceGeneralDeltaOther = this.toDecimalOrNull(
            props.competenceGeneralDeltaOther,
        );
        this.createdAt = props.createdAt;
        this.analytics = props.analytics ?? [];
    }

    static create(props: StrategicReportProps): StrategicReportDomain {
        return new StrategicReportDomain(props);
    }

    withAnalytics(
        analytics: StrategicReportAnalyticsDomain[],
    ): StrategicReportDomain {
        return new StrategicReportDomain({ ...this, analytics });
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
