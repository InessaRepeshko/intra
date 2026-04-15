import { RespondentCategory } from '@intra/shared-kernel';
import Decimal from 'decimal.js';
import { ReportAnalyticsDomain } from './report-analytics.domain';
import { ReportCommentDomain } from './report-comment.domain';
import { ReportInsightDomain } from './report-insight.domain';

export type ReportProps = {
    id?: number;
    reviewId: number;
    cycleId?: number | null;
    respondentCount: number;
    respondentCategories: RespondentCategory[];
    answerCount: number;
    turnoutPctOfTeam?: Decimal.Value | null;
    turnoutPctOfOther?: Decimal.Value | null;
    questionTotAvgBySelf?: Decimal.Value | null;
    questionTotAvgByTeam?: Decimal.Value | null;
    questionTotAvgByOthers?: Decimal.Value | null;
    questionTotPctBySelf?: Decimal.Value | null;
    questionTotPctByTeam?: Decimal.Value | null;
    questionTotPctByOthers?: Decimal.Value | null;
    questionTotDeltaPctByTeam?: Decimal.Value | null;
    questionTotDeltaPctByOthers?: Decimal.Value | null;
    competenceTotAvgBySelf?: Decimal.Value | null;
    competenceTotAvgByTeam?: Decimal.Value | null;
    competenceTotAvgByOthers?: Decimal.Value | null;
    competenceTotPctBySelf?: Decimal.Value | null;
    competenceTotPctByTeam?: Decimal.Value | null;
    competenceTotPctByOthers?: Decimal.Value | null;
    competenceTotDeltaPctByTeam?: Decimal.Value | null;
    competenceTotDeltaPctByOthers?: Decimal.Value | null;
    createdAt?: Date;
    analytics: ReportAnalyticsDomain[];
    comments?: ReportCommentDomain[];
    insights?: ReportInsightDomain[];
};

export class ReportDomain {
    readonly id?: number;
    readonly reviewId: number;
    readonly cycleId?: number | null;
    readonly respondentCount: number;
    readonly respondentCategories: RespondentCategory[];
    readonly answerCount: number;
    readonly turnoutPctOfTeam?: Decimal | null;
    readonly turnoutPctOfOther?: Decimal | null;
    readonly questionTotAvgBySelf?: Decimal | null;
    readonly questionTotAvgByTeam?: Decimal | null;
    readonly questionTotAvgByOthers?: Decimal | null;
    readonly questionTotPctBySelf?: Decimal | null;
    readonly questionTotPctByTeam?: Decimal | null;
    readonly questionTotPctByOthers?: Decimal | null;
    readonly questionTotDeltaPctByTeam?: Decimal | null;
    readonly questionTotDeltaPctByOthers?: Decimal | null;
    readonly competenceTotAvgBySelf?: Decimal | null;
    readonly competenceTotAvgByTeam?: Decimal | null;
    readonly competenceTotAvgByOthers?: Decimal | null;
    readonly competenceTotPctBySelf?: Decimal | null;
    readonly competenceTotPctByTeam?: Decimal | null;
    readonly competenceTotPctByOthers?: Decimal | null;
    readonly competenceTotDeltaPctByTeam?: Decimal | null;
    readonly competenceTotDeltaPctByOthers?: Decimal | null;
    readonly createdAt?: Date;
    readonly analytics: ReportAnalyticsDomain[];
    readonly comments?: ReportCommentDomain[];
    readonly insights?: ReportInsightDomain[];

    private constructor(props: ReportProps) {
        this.id = props.id;
        this.reviewId = props.reviewId;
        this.cycleId = props.cycleId ?? null;
        this.respondentCount = props.respondentCount;
        this.respondentCategories = props.respondentCategories;
        this.answerCount = props.answerCount;
        this.turnoutPctOfTeam = this.toDecimalOrNull(props.turnoutPctOfTeam);
        this.turnoutPctOfOther = this.toDecimalOrNull(props.turnoutPctOfOther);
        this.questionTotAvgBySelf = this.toDecimalOrNull(
            props.questionTotAvgBySelf,
        );
        this.questionTotAvgByTeam = this.toDecimalOrNull(
            props.questionTotAvgByTeam,
        );
        this.questionTotAvgByOthers = this.toDecimalOrNull(
            props.questionTotAvgByOthers,
        );
        this.questionTotPctBySelf = this.toDecimalOrNull(
            props.questionTotPctBySelf,
        );
        this.questionTotPctByTeam = this.toDecimalOrNull(
            props.questionTotPctByTeam,
        );
        this.questionTotPctByOthers = this.toDecimalOrNull(
            props.questionTotPctByOthers,
        );
        this.questionTotDeltaPctByTeam = this.toDecimalOrNull(
            props.questionTotDeltaPctByTeam,
        );
        this.questionTotDeltaPctByOthers = this.toDecimalOrNull(
            props.questionTotDeltaPctByOthers,
        );
        this.competenceTotAvgBySelf = this.toDecimalOrNull(
            props.competenceTotAvgBySelf,
        );
        this.competenceTotAvgByTeam = this.toDecimalOrNull(
            props.competenceTotAvgByTeam,
        );
        this.competenceTotAvgByOthers = this.toDecimalOrNull(
            props.competenceTotAvgByOthers,
        );
        this.competenceTotPctBySelf = this.toDecimalOrNull(
            props.competenceTotPctBySelf,
        );
        this.competenceTotPctByTeam = this.toDecimalOrNull(
            props.competenceTotPctByTeam,
        );
        this.competenceTotPctByOthers = this.toDecimalOrNull(
            props.competenceTotPctByOthers,
        );
        this.competenceTotDeltaPctByTeam = this.toDecimalOrNull(
            props.competenceTotDeltaPctByTeam,
        );
        this.competenceTotDeltaPctByOthers = this.toDecimalOrNull(
            props.competenceTotDeltaPctByOthers,
        );
        this.createdAt = props.createdAt;
        this.analytics = props.analytics ?? [];
        this.comments = props.comments ?? [];
        this.insights = props.insights ?? [];
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

    withInsights(insights: ReportInsightDomain[]): ReportDomain {
        return new ReportDomain({ ...this, insights });
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
