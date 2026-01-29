import { ReportAnalyticsDomain } from './report-analytics.domain';
import { ReportCommentDomain } from './report-comment.domain';

export type ReportProps = {
    id?: number;
    reviewId: number;
    cycleId?: number | null;
    turnoutOfTeam?: number | null;
    turnoutOfOther?: number | null;
    totalAverageBySelfAssessment?: number | null;
    totalAverageByTeam?: number | null;
    totalAverageByOthers?: number | null;
    totalDeltaBySelfAssessment?: number | null;
    totalDeltaByTeam?: number | null;
    totalDeltaByOthers?: number | null;
    analytics?: ReportAnalyticsDomain[];
    comments?: ReportCommentDomain[];
    createdAt?: Date;
};

export class ReportDomain {
    readonly id?: number;
    readonly reviewId: number;
    readonly cycleId?: number | null;
    readonly turnoutOfTeam?: number | null;
    readonly turnoutOfOther?: number | null;
    readonly totalAverageBySelfAssessment?: number | null;
    readonly totalAverageByTeam?: number | null;
    readonly totalAverageByOthers?: number | null;
    readonly totalDeltaBySelfAssessment?: number | null;
    readonly totalDeltaByTeam?: number | null;
    readonly totalDeltaByOthers?: number | null;
    readonly analytics: ReportAnalyticsDomain[];
    readonly comments: ReportCommentDomain[];
    readonly createdAt?: Date;

    private constructor(props: ReportProps) {
        this.id = props.id;
        this.reviewId = props.reviewId;
        this.cycleId = props.cycleId ?? null;
        this.turnoutOfTeam = props.turnoutOfTeam ?? null;
        this.turnoutOfOther = props.turnoutOfOther ?? null;
        this.totalAverageBySelfAssessment =
            props.totalAverageBySelfAssessment ?? null;
        this.totalAverageByTeam = props.totalAverageByTeam ?? null;
        this.totalAverageByOthers = props.totalAverageByOthers ?? null;
        this.totalDeltaBySelfAssessment =
            props.totalDeltaBySelfAssessment ?? null;
        this.totalDeltaByTeam = props.totalDeltaByTeam ?? null;
        this.totalDeltaByOthers = props.totalDeltaByOthers ?? null;
        this.analytics = props.analytics ?? [];
        this.comments = props.comments ?? [];
        this.createdAt = props.createdAt;
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
}
