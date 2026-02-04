import {
    AnswerType,
    EntityType,
    REPORT_ANALYTICS_CONSTRAINTS,
    RespondentCategory,
} from '@intra/shared-kernel';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
import { AnswerDomain } from '../../../feedback360/domain/answer.domain';
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

        const allRespondents = await this.respondents.listByReview(
            reviewId,
            {},
        );
        const respondentCount = allRespondents.length;

        this.logger.debug(
            `Calculated respondent counts: ${respondentCount} total`,
        );

        const answers = await this.answers.list({
            reviewId,
            answerType: AnswerType.NUMERICAL_SCALE,
        });

        const relations = await this.reviewQuestionRelations.listByReview(
            reviewId,
            {},
        );

        const maxScore = REPORT_ANALYTICS_CONSTRAINTS.SCORE.MAX;
        const { questionAnalytics, competenceAnalytics, questionTotals } =
            this.buildAnalyticsPayload(answers, relations, maxScore);

        const report = ReportDomain.create({
            reviewId,
            respondentCount,
            turnoutOfTeam: null,
            turnoutOfOther: null,
            totalAverageBySelfAssessment:
                questionTotals.averageBySelfAssessment,
            totalAverageByTeam: questionTotals.averageByTeam,
            totalAverageByOthers: questionTotals.averageByOthers,
            totalDeltaBySelfAssessment: null,
            totalDeltaByTeam: questionTotals.deltaByTeam,
            totalDeltaByOthers: questionTotals.deltaByOthers,
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

        return fullReport;
    }

    /**
     * Calculates average of numbers, returns null if array is empty
     */
    private calculateAverage(
        numbers: (number | null | undefined)[],
    ): number | null {
        const validNumbers = numbers.filter(
            (n): n is number => n !== null && n !== undefined,
        );
        if (validNumbers.length === 0) return null;
        return validNumbers.reduce((a, b) => a + b, 0) / validNumbers.length;
    }

    /**
     * Rounds number to 2 decimal places
     */
    private round(value: number | null | undefined): number | null {
        if (value === null || value === undefined) return null;
        return Math.round(value * 100) / 100;
    }

    private buildAnalyticsPayload(
        answers: AnswerDomain[],
        relations: ReviewQuestionRelationDomain[],
        maxScore: number,
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
        const answersByQuestion = this.groupAnswersByQuestion(
            answers,
            relations,
        );
        const questionAnalytics: ReportAnalyticsDomain[] = [];
        const competenceAccumulators = new Map<number, CompetenceAccumulator>();
        const questionSelfAverages: number[] = [];
        const questionTeamAverages: number[] = [];
        const questionOtherAverages: number[] = [];

        for (const relation of relations) {
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
                    competenceId: relation.competenceId ?? null,
                    competenceTitle: relation.competenceTitle ?? null,
                    averageBySelfAssessment: this.round(averageBySelf),
                    averageByTeam: this.round(averageByTeam),
                    averageByOther: this.round(averageByOther),
                    deltaBySelfAssessment: null,
                    deltaByTeam: this.round(deltaByTeam),
                    deltaByOther: this.round(deltaByOther),
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
        const competenceSelfAverages: number[] = [];
        const competenceTeamAverages: number[] = [];
        const competenceOtherAverages: number[] = [];

        for (const accumulator of competenceAccumulators.values()) {
            const averageBySelf = this.calculateAverage(accumulator.selfScores);
            const averageByTeam = this.calculateAverage(accumulator.teamScores);
            const averageByOther = this.calculateAverage(
                accumulator.otherScores,
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
                    averageBySelfAssessment: this.round(averageBySelf),
                    averageByTeam: this.round(averageByTeam),
                    averageByOther: this.round(averageByOther),
                    deltaBySelfAssessment: null,
                    deltaByTeam: this.round(deltaByTeam),
                    deltaByOther: this.round(deltaByOther),
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
                averageBySelfAssessment: this.round(questionAverageBySelf),
                averageByTeam: this.round(questionAverageByTeam),
                averageByOthers: this.round(questionAverageByOther),
                deltaByTeam: this.round(questionDeltaByTeam),
                deltaByOthers: this.round(questionDeltaByOther),
            },
        };
    }

    private groupAnswersByQuestion(
        answers: AnswerDomain[],
        relations: ReviewQuestionRelationDomain[],
    ): Map<number, AnswerDomain[]> {
        const allowedQuestionIds = new Set(
            relations.map((relation) => relation.questionId),
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
    ): number | null {
        const values = answers
            .filter(
                (answer) =>
                    answer.respondentCategory === category &&
                    answer.numericalValue !== null &&
                    answer.numericalValue !== undefined,
            )
            .map((answer) => answer.numericalValue!);
        return this.calculateAverage(values);
    }

    private calculateDeltaPercent(
        base: number | null,
        comparison: number | null,
        maxScore: number,
    ): number | null {
        if (base === null || comparison === null || maxScore === 0) {
            return null;
        }
        return ((base - comparison) / maxScore) * 100;
    }
}

type CompetenceAccumulator = {
    competenceId: number;
    competenceTitle: string | null;
    selfScores: number[];
    teamScores: number[];
    otherScores: number[];
};
