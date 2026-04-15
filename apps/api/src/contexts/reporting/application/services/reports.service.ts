import {
    AnswerType,
    CompetenceAccumulator,
    CYCLE_CONSTRAINTS,
    EntityAverageInsightsDto,
    EntityInsightSummaryDto,
    EntitySummaryTotals,
    EntityType,
    IdentityRole,
    InsightType,
    REPORT_ANALYTICS_CONSTRAINTS,
    ReportSearchQuery,
    RESPONDENT_CATEGORIES,
    RespondentCategory,
} from '@intra/shared-kernel';
import {
    ForbiddenException,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import Decimal from 'decimal.js';
import {
    CYCLE_REPOSITORY,
    CycleRepositoryPort,
} from 'src/contexts/feedback360/application/ports/cycle.repository.port';
import {
    REVIEWER_REPOSITORY,
    ReviewerRepositoryPort,
} from 'src/contexts/feedback360/application/ports/reviewer.repository.port';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import {
    ANSWER_REPOSITORY,
    AnswerRepositoryPort,
} from '../../../feedback360/application/ports/answer.repository.port';
import {
    CLUSTER_SCORE_REPOSITORY,
    ClusterScoreRepositoryPort,
} from '../../../feedback360/application/ports/cluster-score.repository.port';
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
import { ClusterScoreDomain } from '../../../feedback360/domain/cluster-score.domain';
import { RespondentDomain } from '../../../feedback360/domain/respondent.domain';
import { ReviewQuestionRelationDomain } from '../../../feedback360/domain/review-question-relation.domain';
import { ReviewDomain } from '../../../feedback360/domain/review.domain';
import {
    CLUSTER_REPOSITORY,
    ClusterRepositoryPort,
} from '../../../library/application/ports/cluster.repository.port';
import { ClusterDomain } from '../../../library/domain/cluster.domain';
import { ReportAnalyticsDomain } from '../../domain/report-analytics.domain';
import { ReportInsightDomain } from '../../domain/report-insight.domain';
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
    REPORT_INSIGHT_REPOSITORY,
    ReportInsightRepositoryPort,
} from '../ports/report-insight.repository.port';
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
        @Inject(REPORT_INSIGHT_REPOSITORY)
        private readonly insightsRepo: ReportInsightRepositoryPort,
        @Inject(REPORT_COMMENT_REPOSITORY)
        private readonly commentsRepo: ReportCommentRepositoryPort,
        @Inject(RESPONDENT_REPOSITORY)
        private readonly respondents: RespondentRepositoryPort,
        @Inject(REVIEWER_REPOSITORY)
        private readonly reviewers: ReviewerRepositoryPort,
        @Inject(ANSWER_REPOSITORY)
        private readonly answers: AnswerRepositoryPort,
        @Inject(REVIEW_QUESTION_RELATION_REPOSITORY)
        private readonly reviewQuestionRelations: ReviewQuestionRelationRepositoryPort,
        @Inject(REVIEW_REPOSITORY)
        private readonly reviews: ReviewRepositoryPort,
        @Inject(CLUSTER_REPOSITORY)
        private readonly clusters: ClusterRepositoryPort,
        @Inject(CLUSTER_SCORE_REPOSITORY)
        private readonly clusterScores: ClusterScoreRepositoryPort,
        @Inject(CYCLE_REPOSITORY)
        private readonly cyclesRepo: CycleRepositoryPort,
    ) {}

    private readonly isProduction = process.env.NODE_ENV === 'production';

    async search(
        query: ReportSearchQuery,
        actor?: UserDomain,
    ): Promise<ReportDomain[]> {
        await this.checkAccessToAllReports(actor);
        return await this.reports.search(query);
    }

    /**
     * Checks if the actor has access to all reports (HR or Admin only).
     * @param actor The actor to check access for.
     */
    async checkAccessToAllReports(actor?: UserDomain): Promise<void> {
        if (!actor) return;

        const isAdminOrHr =
            actor?.roles?.includes(IdentityRole.ADMIN) ||
            actor?.roles?.includes(IdentityRole.HR);

        if (!isAdminOrHr) {
            throw new ForbiddenException(
                'You do not have permission to view this report',
            );
        }
    }

    async getById(id: number, actor?: UserDomain): Promise<ReportDomain> {
        const report = await this.reports.findById(id);

        if (!report) {
            throw new NotFoundException(`Report with id ${id} was not found`);
        }

        await this.checkAccessToReport(report, actor);

        return report;
    }

    /**
     * Checks if the actor has access to the report.
     * @param report The report to check access for.
     * @param actor The actor to check access for.
     */
    async checkAccessToReport(
        report: ReportDomain,
        actor?: UserDomain,
    ): Promise<void> {
        if (!actor) return;

        const isAdminOrHr =
            actor?.roles?.includes(IdentityRole.ADMIN) ||
            actor?.roles?.includes(IdentityRole.HR);

        if (isAdminOrHr) return;

        const review = await this.reviews.findById(report.reviewId);

        if (!review) {
            throw new NotFoundException(`Review for report ${report.id} was not found. 
                Unable to check access to report`);
        }

        const isManagerOfReview = review.managerId === actor.id;
        const isRateeOfReview = review.rateeId === actor.id;

        if (isManagerOfReview || isRateeOfReview) return;

        const reviewers = await this.reviewers.listByReview(review.id!, {
            reviewerId: actor.id,
        });

        if (reviewers.length > 0) return;

        throw new ForbiddenException(
            'You do not have permission to view this report',
        );
    }

    async getByReviewId(
        reviewId: number,
        actor?: UserDomain,
    ): Promise<ReportDomain> {
        const report = await this.reports.findByReviewId(reviewId);
        if (!report) {
            throw new NotFoundException(
                `Report for review ${reviewId} was not found`,
            );
        }

        await this.checkAccessToReport(report, actor);

        return report;
    }

    /**
     * Generates a comprehensive report for a review if anonymity threshold is met.
     * Calculates respondent counts and derives analytics from answers.
     * @param reviewId The ID of the review to generate a report for.
     * @returns The generated report.
     */
    async generateReportForReview(reviewId: number): Promise<ReportDomain> {
        this.logger.debug(`Started report generation for review ${reviewId}`);

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
        const respondentCategories: RespondentCategory[] = [
            ...new Set(
                allRespondents
                    .map((r) => r.category)
                    .sort(
                        (a, b) =>
                            RESPONDENT_CATEGORIES.indexOf(a) -
                            RESPONDENT_CATEGORIES.indexOf(b),
                    ),
            ),
        ];
        const answersCounts =
            await this.answers.getAnswersCountByRespondentCategories(reviewId);

        let answerCount = 0;
        answersCounts.forEach((stat) => {
            answerCount += stat.answers;
        });

        if (this.isProduction) {
            await this.verifyAnonimityThreshold(review, answersCounts);
        }

        const actualAnswersByCategory = answersCounts.reduce(
            (acc, stat) => {
                acc[stat.respondentCategory] = stat.answers;
                return acc;
            },
            {} as Record<string, number>,
        );

        const teamTurnout = this.calculateTurnout(
            allRespondents,
            actualAnswersByCategory[RespondentCategory.TEAM] || 0,
            RespondentCategory.TEAM,
        );
        const otherTurnout = this.calculateTurnout(
            allRespondents,
            actualAnswersByCategory[RespondentCategory.OTHER] || 0,
            RespondentCategory.OTHER,
        );

        this.logger.debug(
            `Calculated respondent counts: ${respondentCount} total in ${respondentCategories.join(', ')} categories, answer count ${answerCount}, team turnout ${teamTurnout}, other turnout ${otherTurnout}`,
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
            respondentCategories,
            answerCount,
            turnoutPctOfTeam: teamTurnout,
            turnoutPctOfOther: otherTurnout,
            questionTotAvgBySelf: questionTotals.averageBySelfAssessment,
            questionTotAvgByTeam: questionTotals.averageByTeam,
            questionTotAvgByOthers: questionTotals.averageByOther,
            questionTotPctBySelf: questionTotals.percentageBySelfAssessment,
            questionTotPctByTeam: questionTotals.percentageByTeam,
            questionTotPctByOthers: questionTotals.percentageByOther,
            questionTotDeltaPctByTeam: questionTotals.deltaPercentageByTeam,
            questionTotDeltaPctByOthers: questionTotals.deltaPercentageByOther,
            competenceTotAvgBySelf: competenceTotals.averageBySelfAssessment,
            competenceTotAvgByTeam: competenceTotals.averageByTeam,
            competenceTotAvgByOthers: competenceTotals.averageByOther,
            competenceTotPctBySelf: competenceTotals.percentageBySelfAssessment,
            competenceTotPctByTeam: competenceTotals.percentageByTeam,
            competenceTotPctByOthers: competenceTotals.percentageByOther,
            competenceTotDeltaPctByTeam: competenceTotals.deltaPercentageByTeam,
            competenceTotDeltaPctByOthers:
                competenceTotals.deltaPercentageByOther,
            analytics: [],
            comments: [],
        });

        const createdReport = await this.reports.create(report);

        await this.analyticsRepo.createMany(createdReport.id!, [
            ...questionAnalytics,
            ...competenceAnalytics,
        ]);

        await this.saveClusterScoresForCompetences(
            competenceAnalytics,
            answers,
            relations,
            review,
        );

        this.logger.debug(
            `Generated ${questionAnalytics.length} question analytics and ${competenceAnalytics.length} competence analytics`,
        );

        const questionInsights = await this.calculateEntityInsights(
            questionAnalytics,
            EntityType.QUESTION,
            createdReport.id!,
        );

        const competenceInsights = await this.calculateEntityInsights(
            competenceAnalytics,
            EntityType.COMPETENCE,
            createdReport.id!,
        );

        await this.insightsRepo.createMany(createdReport.id!, [
            ...questionInsights,
            ...competenceInsights,
        ]);

        this.logger.debug(
            `Generated ${questionInsights.length} question insights and ${competenceInsights.length} competence insights`,
        );

        this.logger.debug(
            `Successfully created report ${createdReport.id} for review ${reviewId}`,
        );

        await this.reviews.updateById(reviewId, {
            reportId: createdReport.id,
        });

        return createdReport;
    }

    /**
     * Verifies that the anonymity threshold is met for the given review.
     * Anonymity threshold is the minimum number of answers
     * required for a review to be valid for report generation.
     * If the threshold is not met, an exception is thrown.
     * @param review The review.
     * @param answers The actual answers.
     */
    private async verifyAnonimityThreshold(
        review: ReviewDomain,
        answersCounts: {
            respondentCategory: RespondentCategory;
            answers: number;
        }[],
    ) {
        let anonimityThreshold;

        if (review.cycleId) {
            const cycle = await this.cyclesRepo.findById(review.cycleId);
            anonimityThreshold = cycle?.minRespondentsThreshold;
        } else {
            anonimityThreshold = CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN;
        }

        let isAnonimityThresholdMet: {
            category: RespondentCategory;
            met: boolean;
        }[] = [];

        if (
            answersCounts.length === 1 &&
            answersCounts[0].respondentCategory ===
                RespondentCategory.SELF_ASSESSMENT
        ) {
            throw new NotFoundException(
                `Not enough answers in category to meet the anonymity threshold ${anonimityThreshold} for review ${review.id}: only self assessment answers available.`,
            );
        }

        answersCounts.forEach((stat) => {
            if (
                stat.respondentCategory === RespondentCategory.SELF_ASSESSMENT
            ) {
                return;
            }

            isAnonimityThresholdMet.push({
                category: stat.respondentCategory,
                met: stat.answers >= anonimityThreshold,
            });
        });

        if (isAnonimityThresholdMet.some((item) => !item.met)) {
            throw new NotFoundException(
                `Not enough answers in category to meet the anonymity threshold ${anonimityThreshold} for review ${review.id}: ${JSON.stringify(isAnonimityThresholdMet)}`,
            );
        }
    }

    /**
     * Saves the cluster scores for the competences.
     * @param competenceAnalytics The competence analytics.
     * @param answers The answers.
     * @param relations The review-question relations.
     * @param review The review.
     */
    private async saveClusterScoresForCompetences(
        competenceAnalytics: ReportAnalyticsDomain[],
        answers: AnswerDomain[],
        relations: ReviewQuestionRelationDomain[],
        review: ReviewDomain,
    ): Promise<void> {
        const questionToCompetence = new Map<number, number>();
        for (const relation of relations) {
            if (
                relation.answerType === AnswerType.NUMERICAL_SCALE &&
                relation.competenceId !== null &&
                relation.competenceId !== undefined
            ) {
                questionToCompetence.set(
                    relation.questionId,
                    relation.competenceId,
                );
            }
        }

        const competenceAnswerCounts = new Map<number, number>();
        for (const answer of answers) {
            if (
                answer.respondentCategory === RespondentCategory.SELF_ASSESSMENT
            )
                continue;
            const competenceId = questionToCompetence.get(answer.questionId);
            if (competenceId === undefined) continue;
            if (
                answer.numericalValue === null ||
                answer.numericalValue === undefined
            )
                continue;
            const current = competenceAnswerCounts.get(competenceId) ?? 0;
            competenceAnswerCounts.set(competenceId, current + 1);
        }

        for (const analytic of competenceAnalytics) {
            const competenceId = analytic.competenceId;
            if (competenceId === null || competenceId === undefined) continue;

            const finalScore = this.calculateCompetenceFinalScore(
                analytic.averageByTeam ?? null,
                analytic.averageByOther ?? null,
            );
            const roundedScore = this.roundDecimal(finalScore);
            if (roundedScore === null) continue;

            const clusters = await this.clusters.search({ competenceId });
            if (!clusters.length) continue;

            const matchedCluster = this.findMatchingCluster(
                roundedScore,
                clusters,
            );
            if (!matchedCluster) {
                this.logger.debug(
                    `Cluster not found for competence ${competenceId} and score ${roundedScore.toFixed(4)}`,
                );
                continue;
            }

            const answersCount = competenceAnswerCounts.get(competenceId) ?? 0;

            await this.clusterScores.upsert(
                ClusterScoreDomain.create({
                    cycleId: review.cycleId ?? null,
                    clusterId: matchedCluster.id!,
                    rateeId: review.rateeId,
                    reviewId: review.id!,
                    score: roundedScore,
                    answersCount,
                }),
            );
        }
    }

    /**
     * Calculates the final score for a competence.
     * @param averageByTeam The average score by team.
     * @param averageByOther The average score by other.
     * @returns The final score.
     */
    private calculateCompetenceFinalScore(
        averageByTeam: Decimal | null,
        averageByOther: Decimal | null,
    ): Decimal | null {
        return this.calculateAverage([averageByTeam, averageByOther]);
    }

    /**
     * Finds the matching cluster for a score.
     * @param score The score to find the cluster for.
     * @param clusters The clusters to search in.
     * @returns The matching cluster.
     */
    private findMatchingCluster(
        score: Decimal,
        clusters: ClusterDomain[],
    ): ClusterDomain | null {
        for (const cluster of clusters) {
            const lower = new Decimal(cluster.lowerBound);
            const upper = new Decimal(cluster.upperBound);
            const isMaxUpper = upper.equals(
                new Decimal(REPORT_ANALYTICS_CONSTRAINTS.SCORE.MAX),
            );
            const meetsLower = score.greaterThanOrEqualTo(lower);
            const meetsUpper = isMaxUpper
                ? score.lessThanOrEqualTo(upper)
                : score.lessThan(upper);
            if (meetsLower && meetsUpper) {
                return cluster;
            }
        }
        return null;
    }

    /**
     * Calculates average of decimals, returns null if array is empty.
     * Formula: sum / count
     * @param numbers The array of numbers to calculate the average of.
     * @returns The average of the numbers as a Decimal, or null if the array is empty.
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
     * @param value The value to normalize.
     * @returns The normalized value.
     */
    private roundDecimal(
        value: Decimal | number | null | undefined,
    ): Decimal | null {
        if (value === null || value === undefined) return null;
        const decimalValue =
            value instanceof Decimal ? value : new Decimal(value);
        return decimalValue.toDecimalPlaces(4);
    }

    /**
     * Calculates the turnout percentage for a specific category of respondents.
     * Formula: (actual answers / assigned respondents) * 100
     * @param respondents The list of all respondents.
     * @param actualAnswers The count of actual answers for the category.
     * @param category The category to calculate turnout for.
     * @returns The turnout percentage as a Decimal, or null if no respondents in category.
     */
    private calculateTurnout(
        respondents: RespondentDomain[],
        actualAnswers: number,
        category: RespondentCategory,
    ): Decimal | null {
        const assignedRespondents = respondents.filter(
            (respondent) => respondent.category === category,
        );

        if (assignedRespondents.length === 0) {
            return null;
        }

        if (actualAnswers === 0) {
            return new Decimal(0);
        }

        const turnout = new Decimal(actualAnswers)
            .dividedBy(assignedRespondents.length)
            .times(100);

        return this.roundDecimal(turnout);
    }

    /**
     * Builds the analytics payload for a report, calculating averages and percentages for questions and competences.
     * @param answers The answers to calculate analytics from.
     * @param relations The review-question relations to determine allowed question IDs.
     * @param maxScore The maximum score for the report.
     * @returns An object containing question analytics, competence analytics, and summary totals.
     */
    private buildAnalyticsPayload(
        answers: AnswerDomain[],
        relations: ReviewQuestionRelationDomain[],
        maxScore: Decimal,
    ): {
        questionAnalytics: ReportAnalyticsDomain[];
        competenceAnalytics: ReportAnalyticsDomain[];
        questionTotals: EntitySummaryTotals;
        competenceTotals: EntitySummaryTotals;
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

            const deltaPercentageByTeam = this.calculateDeltaRating(
                percentageByTeam,
                percentageBySelf,
            );
            const deltaPercentageByOther = this.calculateDeltaRating(
                percentageByOther,
                percentageBySelf,
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
                    percentageBySelfAssessment:
                        this.roundDecimal(percentageBySelf) ?? null,
                    percentageByTeam:
                        this.roundDecimal(percentageByTeam) ?? null,
                    percentageByOther:
                        this.roundDecimal(percentageByOther) ?? null,
                    deltaPercentageByTeam:
                        this.roundDecimal(deltaPercentageByTeam) ?? null,
                    deltaPercentageByOther:
                        this.roundDecimal(deltaPercentageByOther) ?? null,
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

            const deltaPercentageByTeam = this.calculateDeltaRating(
                percentageByTeam,
                percentageBySelf,
            );
            const deltaPercentageByOther = this.calculateDeltaRating(
                percentageByOther,
                percentageBySelf,
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
                    percentageBySelfAssessment:
                        this.roundDecimal(percentageBySelf) ?? null,
                    percentageByTeam:
                        this.roundDecimal(percentageByTeam) ?? null,
                    percentageByOther:
                        this.roundDecimal(percentageByOther) ?? null,
                    deltaPercentageByTeam:
                        this.roundDecimal(deltaPercentageByTeam) ?? null,
                    deltaPercentageByOther:
                        this.roundDecimal(deltaPercentageByOther) ?? null,
                }),
            );
        }

        return {
            questionAnalytics,
            competenceAnalytics,
            questionTotals: this.calculateSummaryTotalsFromValues(
                questionSelfAverages,
                questionTeamAverages,
                questionOtherAverages,
                maxScore,
            ),
            competenceTotals: this.calculateSummaryTotalsFromValues(
                competenceSelfAverages,
                competenceTeamAverages,
                competenceOtherAverages,
                maxScore,
            ),
        };
    }

    /**
     * Groups answers by question ID, filtering for numerical scale answers only.
     * @param answers The answers to group.
     * @param relations The review-question relations to determine allowed question IDs.
     * @returns A map of question IDs to arrays of answers.
     */
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

    /**
     * Calculates the average score for a specific category of respondents.
     * @param answers The answers to calculate the average from.
     * @param category The category of respondents.
     * @returns The average score for the category.
     */
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

    /**
     * Calculates the difference between two values in percentage points.
     * Formula: respondent rating - self rating.
     * @param respondent The respondent rating.
     * @param self The self assessment rating.
     * @returns The difference in percentage points.
     */
    private calculateDeltaRating(
        respondent: Decimal | null,
        self: Decimal | null,
    ): Decimal | null {
        if (respondent === null || self === null) {
            return null;
        }
        return this.roundDecimal(respondent.minus(self));
    }

    /**
     * Calculates the summary totals for a competence.
     * @param analytics The analytics for the competence.
     * @param maxScore The maximum score.
     * @returns The summary totals.
     */
    private calculateCompetenceSummaryTotals(
        analytics: ReportAnalyticsDomain[],
        maxScore: Decimal,
    ): EntitySummaryTotals {
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

        const deltaPercentageByTeam = this.calculateDeltaRating(
            percentageByTeam,
            percentageBySelf,
        );
        const deltaPercentageByOther = this.calculateDeltaRating(
            percentageByOther,
            percentageBySelf,
        );
        return {
            averageBySelfAssessment: this.toRoundedNumber(averageBySelf),
            averageByTeam: this.toRoundedNumber(averageByTeam),
            averageByOther: this.toRoundedNumber(averageByOther),
            percentageBySelfAssessment: this.toRoundedNumber(percentageBySelf),
            percentageByTeam: this.toRoundedNumber(percentageByTeam),
            percentageByOther: this.toRoundedNumber(percentageByOther),
            deltaPercentageByTeam: this.toRoundedNumber(deltaPercentageByTeam),
            deltaPercentageByOther: this.toRoundedNumber(
                deltaPercentageByOther,
            ),
        };
    }

    /**
     * Calculates the percentage of a value relative to a maximum score.
     * Formula: (value / maxScore) * 100
     * @param value The value to calculate the percentage of.
     * @param maxScore The maximum score.
     * @returns The percentage.
     */
    private calculatePercentage(
        value: Decimal | null,
        maxScore: Decimal,
    ): Decimal | null {
        if (value === null || maxScore.isZero()) {
            return null;
        }
        return this.roundDecimal(value.dividedBy(maxScore).times(100));
    }

    /**
     * Rounds a Decimal value to 4 decimal places.
     * @param value The value to round.
     * @returns The rounded value.
     */
    private toRoundedNumber(value: Decimal | null): number | null {
        if (value === null) return null;
        return Number(this.roundDecimal(value)?.toFixed(4));
    }

    /**
     * Calculates the summary totals from arrays of values.
     * @param selfValues The values for self-assessment.
     * @param teamValues The values for team assessment.
     * @param otherValues The values for other assessment.
     * @param maxScore The maximum score.
     * @returns The summary totals.
     */
    private calculateSummaryTotalsFromValues(
        selfValues: Decimal[],
        teamValues: Decimal[],
        otherValues: Decimal[],
        maxScore: Decimal,
    ): EntitySummaryTotals {
        const averageBySelf = this.calculateAverage(selfValues);
        const averageByTeam = this.calculateAverage(teamValues);
        const averageByOther = this.calculateAverage(otherValues);

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

        const deltaPercentageByTeam = this.calculateDeltaRating(
            percentageByTeam,
            percentageBySelf,
        );
        const deltaPercentageByOther = this.calculateDeltaRating(
            percentageByOther,
            percentageBySelf,
        );

        return {
            averageBySelfAssessment: this.toRoundedNumber(averageBySelf),
            averageByTeam: this.toRoundedNumber(averageByTeam),
            averageByOther: this.toRoundedNumber(averageByOther),
            percentageBySelfAssessment: this.toRoundedNumber(percentageBySelf),
            percentageByTeam: this.toRoundedNumber(percentageByTeam),
            percentageByOther: this.toRoundedNumber(percentageByOther),
            deltaPercentageByTeam: this.toRoundedNumber(deltaPercentageByTeam),
            deltaPercentageByOther: this.toRoundedNumber(
                deltaPercentageByOther,
            ),
        };
    }

    /**
     * Calculates the metrics insights for entities (questions or competences).
     * @param entities The entities to calculate the metrics insights for.
     * @param type The type of entities (question or competence).
     * @param reportId The ID of the report.
     * @returns The metrics insights.
     */
    private calculateEntityInsights(
        entities: ReportAnalyticsDomain[],
        type: EntityType,
        reportId: number,
    ): ReportInsightDomain[] {
        const averages: EntityAverageInsightsDto[] = [...entities]
            .sort((a, b) => {
                const nameA =
                    type === EntityType.QUESTION
                        ? (a.questionTitle ?? '')
                        : (a.competenceTitle ?? '');
                const nameB =
                    type === EntityType.QUESTION
                        ? (b.questionTitle ?? '')
                        : (b.competenceTitle ?? '');
                return nameA.localeCompare(nameB);
            })
            .map((entity, index) => {
                return {
                    entityId:
                        type === EntityType.QUESTION
                            ? entity.questionId
                            : entity.competenceId,
                    entityType: type,
                    entityTitle:
                        (type === EntityType.QUESTION
                            ? entity.questionTitle
                            : entity.competenceTitle) ?? '',
                    num: index + 1,
                    averageScore: this.getValidAverage([
                        entity.averageByTeam,
                        entity.averageByOther,
                    ]),
                    averageRating: this.getValidAverage([
                        entity.percentageByTeam,
                        entity.percentageByOther,
                    ]),
                    averageDelta: this.getValidAverage([
                        entity.deltaPercentageByTeam,
                        entity.deltaPercentageByOther,
                    ]),
                };
            });

        const validRatings = averages
            .map((e) => e.averageRating)
            .filter((v): v is number => v !== undefined && v !== null);
        const validDeltas = averages
            .map((e) => e.averageDelta)
            .filter((v): v is number => v !== undefined && v !== null);

        const maxRating =
            validRatings.length > 0 ? Math.max(...validRatings) : null;
        const minRating =
            validRatings.length > 0 ? Math.min(...validRatings) : null;
        const maxDelta =
            validDeltas.length > 0 ? Math.max(...validDeltas) : null;
        const minDelta =
            validDeltas.length > 0 ? Math.min(...validDeltas) : null;

        const insightSummaries: EntityInsightSummaryDto = {
            highestRating:
                maxRating !== null
                    ? averages.find((e) =>
                          new Decimal(e.averageRating ?? 0).equals(maxRating),
                      )
                    : undefined,
            lowestRating:
                minRating !== null
                    ? averages.find((e) =>
                          new Decimal(e.averageRating ?? 0).equals(minRating),
                      )
                    : undefined,
            highestDelta:
                maxDelta !== null
                    ? averages.find((e) =>
                          new Decimal(e.averageDelta ?? 0).equals(maxDelta),
                      )
                    : undefined,
            lowestDelta:
                minDelta !== null
                    ? averages.find((e) =>
                          new Decimal(e.averageDelta ?? 0).equals(minDelta),
                      )
                    : undefined,
        };

        const insights: ReportInsightDomain[] = [];

        insights.push(
            ReportInsightDomain.create({
                reportId: reportId!,
                insightType: InsightType.HIGHEST_RATING,
                entityType: type,
                questionId:
                    type === EntityType.QUESTION
                        ? (insightSummaries.highestRating?.entityId ?? null)
                        : null,
                questionTitle:
                    type === EntityType.QUESTION
                        ? (insightSummaries.highestRating?.entityTitle ?? null)
                        : null,
                competenceId:
                    type === EntityType.COMPETENCE
                        ? (insightSummaries.highestRating?.entityId ?? null)
                        : null,
                competenceTitle:
                    type === EntityType.COMPETENCE
                        ? (insightSummaries.highestRating?.entityTitle ?? null)
                        : null,
                averageScore: insightSummaries.highestRating?.averageScore,
                averageRating: insightSummaries.highestRating?.averageRating,
                averageDelta: insightSummaries.highestRating?.averageDelta,
                createdAt: undefined,
            }),
        );

        insights.push(
            ReportInsightDomain.create({
                reportId: reportId!,
                insightType: InsightType.LOWEST_RATING,
                entityType: type,
                questionId:
                    type === EntityType.QUESTION
                        ? (insightSummaries.lowestRating?.entityId ?? null)
                        : null,
                questionTitle:
                    type === EntityType.QUESTION
                        ? (insightSummaries.lowestRating?.entityTitle ?? null)
                        : null,
                competenceId:
                    type === EntityType.COMPETENCE
                        ? (insightSummaries.lowestRating?.entityId ?? null)
                        : null,
                competenceTitle:
                    type === EntityType.COMPETENCE
                        ? (insightSummaries.lowestRating?.entityTitle ?? null)
                        : null,
                averageScore: insightSummaries.lowestRating?.averageScore,
                averageRating: insightSummaries.lowestRating?.averageRating,
                averageDelta: insightSummaries.lowestRating?.averageDelta,
                createdAt: undefined,
            }),
        );

        insights.push(
            ReportInsightDomain.create({
                reportId: reportId!,
                insightType: InsightType.HIGHEST_DELTA,
                entityType: type,
                questionId:
                    type === EntityType.QUESTION
                        ? (insightSummaries.highestDelta?.entityId ?? null)
                        : null,
                questionTitle:
                    type === EntityType.QUESTION
                        ? (insightSummaries.highestDelta?.entityTitle ?? null)
                        : null,
                competenceId:
                    type === EntityType.COMPETENCE
                        ? (insightSummaries.highestDelta?.entityId ?? null)
                        : null,
                competenceTitle:
                    type === EntityType.COMPETENCE
                        ? (insightSummaries.highestDelta?.entityTitle ?? null)
                        : null,
                averageScore: insightSummaries.highestDelta?.averageScore,
                averageRating: insightSummaries.highestDelta?.averageRating,
                averageDelta: insightSummaries.highestDelta?.averageDelta,
                createdAt: undefined,
            }),
        );

        insights.push(
            ReportInsightDomain.create({
                reportId: reportId!,
                insightType: InsightType.LOWEST_DELTA,
                entityType: type,
                questionId:
                    type === EntityType.QUESTION
                        ? (insightSummaries.lowestDelta?.entityId ?? null)
                        : null,
                questionTitle:
                    type === EntityType.QUESTION
                        ? (insightSummaries.lowestDelta?.entityTitle ?? null)
                        : null,
                competenceId:
                    type === EntityType.COMPETENCE
                        ? (insightSummaries.lowestDelta?.entityId ?? null)
                        : null,
                competenceTitle:
                    type === EntityType.COMPETENCE
                        ? (insightSummaries.lowestDelta?.entityTitle ?? null)
                        : null,
                averageScore: insightSummaries.lowestDelta?.averageScore,
                averageRating: insightSummaries.lowestDelta?.averageRating,
                averageDelta: insightSummaries.lowestDelta?.averageDelta,
                createdAt: undefined,
            }),
        );

        return insights;
    }

    /**
     * Calculates the average of an array of numbers.
     * @param arr The array of numbers.
     * @returns The average of the numbers.
     */
    private getValidAverage = (arr: (Decimal | null | undefined)[]) => {
        const validValues = arr.filter(
            (val): val is Decimal => val !== null && val !== undefined,
        );
        if (validValues.length === 0) return null;
        return this.calculateAverageNumberForArray(validValues);
    };

    /**
     * Calculates the average of an array of numbers.
     * @param numbers The array of numbers.
     * @returns The average of the numbers.
     */
    private calculateAverageNumberForArray(numbers: Decimal[]): Decimal {
        let sum = Decimal(0);
        for (const number of numbers) {
            sum = sum.add(number);
        }
        return sum.div(numbers.length);
    }
}
