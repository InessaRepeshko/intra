import { ReportAnalyticsDomain } from './report-analytics.domain';
import { ReportCommentDomain } from './report-comment.domain';

export type ReportProps = {
    id?: number;
    reviewId: number;
    cycleId?: number | null;
    respondentCount: number;
    turnoutOfTeam?: number | null;
    turnoutOfOther?: number | null;
    totalAverageBySelfAssessment?: number | null;
    totalAverageByTeam?: number | null;
    totalAverageByOthers?: number | null;
    totalDeltaByTeam?: number | null;
    totalDeltaByOthers?: number | null;
    totalAverageCompetenceBySelfAssessment?: number | null;
    totalAverageCompetenceByTeam?: number | null;
    totalAverageCompetenceByOthers?: number | null;
    totalCompetencePercentageBySelfAssessment?: number | null;
    totalCompetencePercentageByTeam?: number | null;
    totalCompetencePercentageByOthers?: number | null;
    createdAt?: Date;
    analytics: ReportAnalyticsDomain[];
    comments?: ReportCommentDomain[];
};

export class ReportDomain {
    readonly id?: number;
    readonly reviewId: number;
    readonly cycleId?: number | null;
    readonly respondentCount: number;
    readonly turnoutOfTeam?: number | null;
    readonly turnoutOfOther?: number | null;
    readonly totalAverageBySelfAssessment?: number | null;
    readonly totalAverageByTeam?: number | null;
    readonly totalAverageByOthers?: number | null;
    readonly totalDeltaByTeam?: number | null;
    readonly totalDeltaByOthers?: number | null;
    readonly totalAverageCompetenceBySelfAssessment?: number | null;
    readonly totalAverageCompetenceByTeam?: number | null;
    readonly totalAverageCompetenceByOthers?: number | null;
    readonly totalCompetencePercentageBySelfAssessment?: number | null;
    readonly totalCompetencePercentageByTeam?: number | null;
    readonly totalCompetencePercentageByOthers?: number | null;
    readonly createdAt?: Date;
    readonly analytics: ReportAnalyticsDomain[];
    readonly comments?: ReportCommentDomain[];

    private constructor(props: ReportProps) {
        this.id = props.id;
        this.reviewId = props.reviewId;
        this.cycleId = props.cycleId ?? null;
        this.respondentCount = props.respondentCount;
        this.turnoutOfTeam = props.turnoutOfTeam ?? null;
        this.turnoutOfOther = props.turnoutOfOther ?? null;
        this.totalAverageBySelfAssessment =
            props.totalAverageBySelfAssessment ?? null;
        this.totalAverageByTeam = props.totalAverageByTeam ?? null;
        this.totalAverageByOthers = props.totalAverageByOthers ?? null;
        this.totalDeltaByTeam = props.totalDeltaByTeam ?? null;
        this.totalDeltaByOthers = props.totalDeltaByOthers ?? null;
        this.totalAverageCompetenceBySelfAssessment =
            props.totalAverageCompetenceBySelfAssessment ?? null;
        this.totalAverageCompetenceByTeam =
            props.totalAverageCompetenceByTeam ?? null;
        this.totalAverageCompetenceByOthers =
            props.totalAverageCompetenceByOthers ?? null;
        this.totalCompetencePercentageBySelfAssessment =
            props.totalCompetencePercentageBySelfAssessment ?? null;
        this.totalCompetencePercentageByTeam =
            props.totalCompetencePercentageByTeam ?? null;
        this.totalCompetencePercentageByOthers =
            props.totalCompetencePercentageByOthers ?? null;
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
}
