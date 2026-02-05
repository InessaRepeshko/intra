import Decimal from 'decimal.js';
import { ReportAnalyticsDomain } from './report-analytics.domain';
import { ReportCommentDomain } from './report-comment.domain';

export type ReportProps = {
    id?: number;
    reviewId: number;
    cycleId?: number | null;
    respondentCount: number;
    turnoutOfTeam?: Decimal.Value | null;
    turnoutOfOther?: Decimal.Value | null;
    totalAverageBySelfAssessment?: Decimal.Value | null;
    totalAverageByTeam?: Decimal.Value | null;
    totalAverageByOthers?: Decimal.Value | null;
    totalDeltaByTeam?: Decimal.Value | null;
    totalDeltaByOthers?: Decimal.Value | null;
    totalAverageCompetenceBySelfAssessment?: Decimal.Value | null;
    totalAverageCompetenceByTeam?: Decimal.Value | null;
    totalAverageCompetenceByOthers?: Decimal.Value | null;
    totalCompetencePercentageBySelfAssessment?: Decimal.Value | null;
    totalCompetencePercentageByTeam?: Decimal.Value | null;
    totalCompetencePercentageByOthers?: Decimal.Value | null;
    createdAt?: Date;
    analytics: ReportAnalyticsDomain[];
    comments?: ReportCommentDomain[];
};

export class ReportDomain {
    readonly id?: number;
    readonly reviewId: number;
    readonly cycleId?: number | null;
    readonly respondentCount: number;
    readonly turnoutOfTeam?: Decimal | null;
    readonly turnoutOfOther?: Decimal | null;
    readonly totalAverageBySelfAssessment?: Decimal | null;
    readonly totalAverageByTeam?: Decimal | null;
    readonly totalAverageByOthers?: Decimal | null;
    readonly totalDeltaByTeam?: Decimal | null;
    readonly totalDeltaByOthers?: Decimal | null;
    readonly totalAverageCompetenceBySelfAssessment?: Decimal | null;
    readonly totalAverageCompetenceByTeam?: Decimal | null;
    readonly totalAverageCompetenceByOthers?: Decimal | null;
    readonly totalCompetencePercentageBySelfAssessment?: Decimal | null;
    readonly totalCompetencePercentageByTeam?: Decimal | null;
    readonly totalCompetencePercentageByOthers?: Decimal | null;
    readonly createdAt?: Date;
    readonly analytics: ReportAnalyticsDomain[];
    readonly comments?: ReportCommentDomain[];

    private constructor(props: ReportProps) {
        this.id = props.id;
        this.reviewId = props.reviewId;
        this.cycleId = props.cycleId ?? null;
        this.respondentCount = props.respondentCount;
        this.turnoutOfTeam = this.toDecimalOrNull(props.turnoutOfTeam);
        this.turnoutOfOther = this.toDecimalOrNull(props.turnoutOfOther);
        this.totalAverageBySelfAssessment = this.toDecimalOrNull(
            props.totalAverageBySelfAssessment,
        );
        this.totalAverageByTeam = this.toDecimalOrNull(
            props.totalAverageByTeam,
        );
        this.totalAverageByOthers = this.toDecimalOrNull(
            props.totalAverageByOthers,
        );
        this.totalDeltaByTeam = this.toDecimalOrNull(props.totalDeltaByTeam);
        this.totalDeltaByOthers = this.toDecimalOrNull(
            props.totalDeltaByOthers,
        );
        this.totalAverageCompetenceBySelfAssessment = this.toDecimalOrNull(
            props.totalAverageCompetenceBySelfAssessment,
        );
        this.totalAverageCompetenceByTeam = this.toDecimalOrNull(
            props.totalAverageCompetenceByTeam,
        );
        this.totalAverageCompetenceByOthers = this.toDecimalOrNull(
            props.totalAverageCompetenceByOthers,
        );
        this.totalCompetencePercentageBySelfAssessment = this.toDecimalOrNull(
            props.totalCompetencePercentageBySelfAssessment,
        );
        this.totalCompetencePercentageByTeam = this.toDecimalOrNull(
            props.totalCompetencePercentageByTeam,
        );
        this.totalCompetencePercentageByOthers = this.toDecimalOrNull(
            props.totalCompetencePercentageByOthers,
        );
        this.createdAt = props.createdAt;
        this.analytics = props.analytics ?? [];
        this.comments = props.comments ?? [];
    }

    static create(props: ReportProps): ReportDomain {
        return new ReportDomain(props);
    }

    withAnalytics(analytics: ReportAnalyticsDomain[]): ReportDomain {
        return new ReportDomain({ ...this, analytics });
    }

    withComments(comments: ReportCommentDomain[]): ReportDomain {
        return new ReportDomain({ ...this, comments });
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
