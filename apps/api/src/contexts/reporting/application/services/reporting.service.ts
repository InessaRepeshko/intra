import {
    AnswerType,
    CompetenceAccumulator,
    CompetenceSummaryTotals,
    EntityType,
    REPORT_ANALYTICS_CONSTRAINTS,
    RespondentCategory,
    ResponseStatus,
} from '@intra/shared-kernel';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import Decimal from 'decimal.js';
import {
    ANSWER_REPOSITORY,
    AnswerRepositoryPort,
} from '../../../feedback360/application/ports/answer.repository.port';
import {
    RESPONDENT_REPOSITORY,
    RespondentRepositoryPort,
} from '../../../feedback360/application/ports/respondent.repository.port';
import {
    REVIEW_QUESTION_RELATION_REPOSITORY,
    ReviewQuestionRelationRepositoryPort,
} from '../../../feedback360/application/ports/review-question-relation.repository.port';
import {
    REVIEW_REPOSITORY,
    ReviewRepositoryPort,
} from '../../../feedback360/application/ports/review.repository.port';
import { AnswerDomain } from '../../../feedback360/domain/answer.domain';
import { RespondentDomain } from '../../../feedback360/domain/respondent.domain';
import { ReviewQuestionRelationDomain } from '../../../feedback360/domain/review-question-relation.domain';
import { ReportAnalyticsDomain } from '../../domain/report-analytics.domain';
import { ReportDomain } from '../../domain/report.domain';
import {
    REPORT_ANALYTICS_REPOSITORY,
    ReportAnalyticsRepositoryPort,
} from '../ports/report-analytics.repository.port';
import {
    REPORT_COMMENT_REPOSITORY,
    ReportCommentRepositoryPort,
} from '../ports/report-comment.repository.port';
import {
    REPORT_REPOSITORY,
    ReportRepositoryPort,
} from '../ports/report.repository.port';

@Injectable()
export class ReportingService {
    private readonly logger = new Logger(ReportingService.name);

    constructor(
        @Inject(REPORT_REPOSITORY)
        private readonly reports: ReportRepositoryPort,
        @Inject(REPORT_ANALYTICS_REPOSITORY)
        private readonly analyticsRepo: ReportAnalyticsRepositoryPort,
        @Inject(REPORT_COMMENT_REPOSITORY)
        private readonly commentsRepo: ReportCommentRepositoryPort,
        @Inject(RESPONDENT_REPOSITORY)
        private readonly respondents: RespondentRepositoryPort,
        @Inject(ANSWER_REPOSITORY)
        private readonly answers: AnswerRepositoryPort,
        @Inject(REVIEW_QUESTION_RELATION_REPOSITORY)
        private readonly reviewQuestionRelations: ReviewQuestionRelationRepositoryPort,
        @Inject(REVIEW_REPOSITORY)
        private readonly reviews: ReviewRepositoryPort,
    ) {}

    async getById(id: number): Promise<ReportDomain> {
        const report = await this.reports.findById(id);
        if (!report) {
            throw new NotFoundException(`Report with id ${id} was not found`);
        }

        return report;
    }

    async getByReviewId(reviewId: number): Promise<ReportDomain> {
        const report = await this.reports.findByReviewId(reviewId);
        if (!report) {
            throw new NotFoundException(
                `Report for review ${reviewId} was not found`,
            );
        }

        return report;
    }

    /**
     * Generates a comprehensive report for a review
     * Calculates respondent counts and derives analytics from answers
     */
    async generateReportForReview(reviewId: number): Promise<ReportDomain> {
        this.logger.debug(`Starting report generation for review ${reviewId}`);

        const existing = await this.reports.findByReviewId(reviewId);
        if (existing) {
            this.logger.debug(`Report already exists for review ${reviewId}`);
            return existing;
        }

        const review = await this.reviews.findById(reviewId);
        if (!review) {
            throw new NotFoundException(`Review with id ${reviewId} not found`);
        }

        const allRespondents = await this.respondents.listByReview(
            reviewId,
            {},
        );
        const respondentCount = allRespondents.length;
        const teamTurnout = this.calculateTurnout(
            allRespondents,
            RespondentCategory.TEAM,
        );
        const otherTurnout = this.calculateTurnout(
            allRespondents,
            RespondentCategory.OTHER,
        );

        this.logger.debug(
            `Calculated respondent counts: ${respondentCount} total, team turnout ${teamTurnout}, other turnout ${otherTurnout}`,
        );

        const answers = await this.answers.list({
            reviewId,
            answerType: AnswerType.NUMERICAL_SCALE,
        });

        const relations = await this.reviewQuestionRelations.listByReview(
            reviewId,
            {},
        );

        const maxScore = new Decimal(REPORT_ANALYTICS_CONSTRAINTS.SCORE.MAX);
        const { questionAnalytics, competenceAnalytics, questionTotals } =
            this.buildAnalyticsPayload(answers, relations, maxScore);
        const competenceTotals = this.calculateCompetenceSummaryTotals(
            competenceAnalytics,
            maxScore,
        );

        const report = ReportDomain.create({
            reviewId,
            cycleId: review.cycleId,
            respondentCount,
            turnoutOfTeam: teamTurnout,
            turnoutOfOther: otherTurnout,
            totalAverageBySelfAssessment:
                questionTotals.averageBySelfAssessment,
            totalAverageByTeam: questionTotals.averageByTeam,
            totalAverageByOthers: questionTotals.averageByOthers,
            totalDeltaByTeam: questionTotals.deltaByTeam,
            totalDeltaByOthers: questionTotals.deltaByOthers,
            totalAverageCompetenceBySelfAssessment:
                competenceTotals.averageBySelfAssessment,
            totalAverageCompetenceByTeam: competenceTotals.averageByTeam,
            totalAverageCompetenceByOthers: competenceTotals.averageByOther,
            totalCompetencePercentageBySelfAssessment:
                competenceTotals.percentageBySelfAssessment,
            totalCompetencePercentageByTeam: competenceTotals.percentageByTeam,
            totalCompetencePercentageByOthers:
                competenceTotals.percentageByOther,
            analytics: [],
            comments: [],
        });

        const created = await this.reports.create(report);

        await this.analyticsRepo.createMany(created.id!, [
            ...questionAnalytics,
            ...competenceAnalytics,
        ]);

        this.logger.debug(
            `Generated ${questionAnalytics.length} question analytics and ${competenceAnalytics.length} competence analytics`,
        );

        const fullReport = await this.reports.findById(created.id!);
        if (!fullReport) {
            throw new NotFoundException(
                `Report ${created.id} could not be loaded after creation`,
            );
        }

        this.logger.debug(
            `Successfully created report ${fullReport.id} for review ${reviewId}`,
        );

        await this.reviews.updateById(reviewId, {
            reportId: fullReport.id,
        });

        return fullReport;
    }

    /**
     * Calculates average of decimals, returns null if array is empty
     */
    private calculateAverage(
        numbers: (Decimal | number | null | undefined)[],
    ): Decimal | null {
        const validNumbers = numbers
            .filter((n): n is Decimal | number => n !== null && n !== undefined)
            .map((n) => (n instanceof Decimal ? n : new Decimal(n)));
        if (validNumbers.length === 0) return null;
        const sum = validNumbers.reduce(
            (acc, value) => acc.plus(value),
            new Decimal(0),
        );
        return sum.dividedBy(validNumbers.length);
    }

    /**
     * Normalizes decimal scale to 4 digits (or null)
     */
    private roundDecimal(
        value: Decimal | number | null | undefined,
    ): Decimal | null {
        if (value === null || value === undefined) return null;
        const decimalValue =
            value instanceof Decimal ? value : new Decimal(value);
        return decimalValue.toDecimalPlaces(4);
    }

    private calculateTurnout(
        respondents: RespondentDomain[],
        category: RespondentCategory,
    ): Decimal | null {
        const categoryRespondents = respondents.filter(
            (respondent) => respondent.category === category,
        );
        if (categoryRespondents.length === 0) {
            return null;
        }

        const completed = categoryRespondents.filter(
            (respondent) =>
                respondent.responseStatus === ResponseStatus.COMPLETED,
        ).length;

        const turnout = new Decimal(completed)
            .dividedBy(categoryRespondents.length)
            .times(100);
        return this.roundDecimal(turnout);
    }

    private buildAnalyticsPayload(
        answers: AnswerDomain[],
        relations: ReviewQuestionRelationDomain[],
        maxScore: Decimal,
    ): {
        questionAnalytics: ReportAnalyticsDomain[];
        competenceAnalytics: ReportAnalyticsDomain[];
        questionTotals: {
            averageBySelfAssessment: number | null;
            averageByTeam: number | null;
            averageByOthers: number | null;
            deltaByTeam: number | null;
            deltaByOthers: number | null;
        };
    } {
        const numericalRelations = relations.filter(
            (r) => r.answerType === AnswerType.NUMERICAL_SCALE,
        );

        const answersByQuestion = this.groupAnswersByQuestion(
            answers,
            numericalRelations,
        );
        const questionAnalytics: ReportAnalyticsDomain[] = [];
        const competenceAccumulators = new Map<number, CompetenceAccumulator>();
        const questionSelfAverages: Decimal[] = [];
        const questionTeamAverages: Decimal[] = [];
        const questionOtherAverages: Decimal[] = [];

        for (const relation of numericalRelations) {
            const questionAnswers =
                answersByQuestion.get(relation.questionId) ?? [];

            const averageBySelf = this.calculateAverageByCategory(
                questionAnswers,
                RespondentCategory.SELF_ASSESSMENT,
            );
            const averageByTeam = this.calculateAverageByCategory(
                questionAnswers,
                RespondentCategory.TEAM,
            );
            const averageByOther = this.calculateAverageByCategory(
                questionAnswers,
                RespondentCategory.OTHER,
            );

            if (averageBySelf !== null) {
                questionSelfAverages.push(averageBySelf);
            }
            if (averageByTeam !== null) {
                questionTeamAverages.push(averageByTeam);
            }
            if (averageByOther !== null) {
                questionOtherAverages.push(averageByOther);
            }

            const deltaByTeam = this.calculateDeltaPercent(
                averageBySelf,
                averageByTeam,
                maxScore,
            );
            const deltaByOther = this.calculateDeltaPercent(
                averageBySelf,
                averageByOther,
                maxScore,
            );

            questionAnalytics.push(
                ReportAnalyticsDomain.create({
                    reportId: 0,
                    entityType: EntityType.QUESTION,
                    questionId: relation.questionId,
                    questionTitle: relation.questionTitle,
                    competenceId: null,
                    competenceTitle: null,
                    averageBySelfAssessment:
                        this.roundDecimal(averageBySelf) ?? null,
                    averageByTeam: this.roundDecimal(averageByTeam) ?? null,
                    averageByOther: this.roundDecimal(averageByOther) ?? null,
                    deltaByTeam: this.roundDecimal(deltaByTeam) ?? null,
                    deltaByOther: this.roundDecimal(deltaByOther) ?? null,
                }),
            );

            const competenceId = relation.competenceId;
            if (competenceId !== null && competenceId !== undefined) {
                const accumulator = competenceAccumulators.get(
                    competenceId,
                ) ?? {
                    competenceId,
                    competenceTitle: relation.competenceTitle ?? null,
                    selfScores: [],
                    teamScores: [],
                    otherScores: [],
                };

                if (averageBySelf !== null) {
                    accumulator.selfScores.push(averageBySelf);
                }
                if (averageByTeam !== null) {
                    accumulator.teamScores.push(averageByTeam);
                }
                if (averageByOther !== null) {
                    accumulator.otherScores.push(averageByOther);
                }

                competenceAccumulators.set(competenceId, accumulator);
            }
        }

        const competenceAnalytics: ReportAnalyticsDomain[] = [];
        const competenceSelfAverages: Decimal[] = [];
        const competenceTeamAverages: Decimal[] = [];
        const competenceOtherAverages: Decimal[] = [];

        for (const accumulator of competenceAccumulators.values()) {
            const averageBySelf = this.calculateAverage(
                accumulator.selfScores.map((s) => new Decimal(s)),
            );
            const averageByTeam = this.calculateAverage(
                accumulator.teamScores.map((s) => new Decimal(s)),
            );
            const averageByOther = this.calculateAverage(
                accumulator.otherScores.map((s) => new Decimal(s)),
            );

            if (averageBySelf !== null) {
                competenceSelfAverages.push(averageBySelf);
            }
            if (averageByTeam !== null) {
                competenceTeamAverages.push(averageByTeam);
            }
            if (averageByOther !== null) {
                competenceOtherAverages.push(averageByOther);
            }

            const deltaByTeam = this.calculateDeltaPercent(
                averageBySelf,
                averageByTeam,
                maxScore,
            );
            const deltaByOther = this.calculateDeltaPercent(
                averageBySelf,
                averageByOther,
                maxScore,
            );

            competenceAnalytics.push(
                ReportAnalyticsDomain.create({
                    reportId: 0,
                    entityType: EntityType.COMPETENCE,
                    questionId: null,
                    questionTitle: null,
                    competenceId: accumulator.competenceId,
                    competenceTitle: accumulator.competenceTitle,
                    averageBySelfAssessment:
                        this.roundDecimal(averageBySelf) ?? null,
                    averageByTeam: this.roundDecimal(averageByTeam) ?? null,
                    averageByOther: this.roundDecimal(averageByOther) ?? null,
                    deltaByTeam: this.roundDecimal(deltaByTeam) ?? null,
                    deltaByOther: this.roundDecimal(deltaByOther) ?? null,
                }),
            );
        }

        const questionAverageBySelf =
            this.calculateAverage(questionSelfAverages);
        const questionAverageByTeam =
            this.calculateAverage(questionTeamAverages);
        const questionAverageByOther = this.calculateAverage(
            questionOtherAverages,
        );

        const questionDeltaByTeam = this.calculateDeltaPercent(
            questionAverageBySelf,
            questionAverageByTeam,
            maxScore,
        );
        const questionDeltaByOther = this.calculateDeltaPercent(
            questionAverageBySelf,
            questionAverageByOther,
            maxScore,
        );

        return {
            questionAnalytics,
            competenceAnalytics,
            questionTotals: {
                averageBySelfAssessment: this.toRoundedNumber(
                    questionAverageBySelf,
                ),
                averageByTeam: this.toRoundedNumber(questionAverageByTeam),
                averageByOthers: this.toRoundedNumber(questionAverageByOther),
                deltaByTeam: this.toRoundedNumber(questionDeltaByTeam),
                deltaByOthers: this.toRoundedNumber(questionDeltaByOther),
            },
        };
    }

    private groupAnswersByQuestion(
        answers: AnswerDomain[],
        relations: ReviewQuestionRelationDomain[],
    ): Map<number, AnswerDomain[]> {
        const allowedQuestionIds = new Set(
            relations
                .filter(
                    (relation) =>
                        relation.answerType === AnswerType.NUMERICAL_SCALE,
                )
                .map((relation) => relation.questionId),
        );
        const grouped = new Map<number, AnswerDomain[]>();
        for (const answer of answers) {
            if (!allowedQuestionIds.has(answer.questionId)) {
                continue;
            }
            const bucket = grouped.get(answer.questionId) ?? [];
            bucket.push(answer);
            grouped.set(answer.questionId, bucket);
        }
        return grouped;
    }

    private calculateAverageByCategory(
        answers: AnswerDomain[],
        category: RespondentCategory,
    ): Decimal | null {
        const values = answers
            .filter(
                (answer) =>
                    answer.respondentCategory === category &&
                    answer.numericalValue !== null &&
                    answer.numericalValue !== undefined,
            )
            .map((answer) => new Decimal(answer.numericalValue!));
        return this.calculateAverage(values);
    }

    private calculateDeltaPercent(
        base: Decimal | null,
        comparison: Decimal | null,
        maxScore: Decimal,
    ): Decimal | null {
        if (base === null || comparison === null || maxScore.isZero()) {
            return null;
        }
        const delta = base.minus(comparison).dividedBy(maxScore).times(100);
        return this.roundDecimal(delta);
    }

    private calculateCompetenceSummaryTotals(
        analytics: ReportAnalyticsDomain[],
        maxScore: Decimal,
    ): CompetenceSummaryTotals {
        const averageBySelf = this.calculateAverage(
            analytics.map((item) => item.averageBySelfAssessment),
        );
        const averageByTeam = this.calculateAverage(
            analytics.map((item) => item.averageByTeam),
        );
        const averageByOther = this.calculateAverage(
            analytics.map((item) => item.averageByOther),
        );

        const percentageBySelf = this.calculatePercentage(
            averageBySelf,
            maxScore,
        );
        const percentageByTeam = this.calculatePercentage(
            averageByTeam,
            maxScore,
        );
        const percentageByOther = this.calculatePercentage(
            averageByOther,
            maxScore,
        );

        return {
            averageBySelfAssessment: this.toRoundedNumber(averageBySelf),
            averageByTeam: this.toRoundedNumber(averageByTeam),
            averageByOther: this.toRoundedNumber(averageByOther),
            percentageBySelfAssessment: this.toRoundedNumber(percentageBySelf),
            percentageByTeam: this.toRoundedNumber(percentageByTeam),
            percentageByOther: this.toRoundedNumber(percentageByOther),
        };
    }

    private calculatePercentage(
        value: Decimal | null,
        maxScore: Decimal,
    ): Decimal | null {
        if (value === null || maxScore.isZero()) {
            return null;
        }
        return this.roundDecimal(value.dividedBy(maxScore).times(100));
    }

    private toRoundedNumber(value: Decimal | null): number | null {
        if (value === null) return null;
        return Number(this.roundDecimal(value)?.toFixed(4));
    }
}
