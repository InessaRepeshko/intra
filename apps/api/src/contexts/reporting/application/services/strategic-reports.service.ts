import {
    EntityAverageInsightsDto,
    EntityInsightSummaryDto,
    EntitySummaryTotals,
    EntityType,
    IdentityRole,
    InsightType,
    REPORT_ANALYTICS_CONSTRAINTS,
    RespondentCategory,
    StrategicReportSearchQuery,
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
    QUESTION_REPOSITORY,
    QuestionRepositoryPort,
} from 'src/contexts/feedback360/application/ports/question.repository.port';
import {
    REVIEWER_REPOSITORY,
    ReviewerRepositoryPort,
} from 'src/contexts/feedback360/application/ports/reviewer.repository.port';
import { QuestionDomain } from 'src/contexts/feedback360/domain/question.domain';
import { ReviewerDomain } from 'src/contexts/feedback360/domain/reviewer.domain';
import {
    IDENTITY_USER_REPOSITORY,
    UserRepositoryPort,
} from 'src/contexts/identity/application/ports/user.repository.port';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import {
    COMPETENCE_REPOSITORY,
    CompetenceRepositoryPort,
} from 'src/contexts/library/application/ports/competence.repository.port';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import {
    ORGANISATION_POSITION_REPOSITORY,
    PositionRepositoryPort,
} from 'src/contexts/organisation/application/ports/position.repository.port';
import {
    ORGANISATION_TEAM_REPOSITORY,
    TeamRepositoryPort,
} from 'src/contexts/organisation/application/ports/team.repository.port';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { TeamDomain } from 'src/contexts/organisation/domain/team.domain';
import {
    ANSWER_REPOSITORY,
    AnswerRepositoryPort,
} from '../../../feedback360/application/ports/answer.repository.port';
import {
    RESPONDENT_REPOSITORY,
    RespondentRepositoryPort,
} from '../../../feedback360/application/ports/respondent.repository.port';
import {
    REVIEW_REPOSITORY,
    ReviewRepositoryPort,
} from '../../../feedback360/application/ports/review.repository.port';
import { AnswerDomain } from '../../../feedback360/domain/answer.domain';
import { RespondentDomain } from '../../../feedback360/domain/respondent.domain';
import { ReviewDomain } from '../../../feedback360/domain/review.domain';
import { ReportAnalyticsDomain } from '../../domain/report-analytics.domain';
import { StrategicReportInsightDomain } from '../../domain/startegic-report-insight.domain';
import { StrategicReportAnalyticsDomain } from '../../domain/strategic-report-analytics.domain';
import { StrategicReportDomain } from '../../domain/strategic-report.domain';
import {
    REPORT_ANALYTICS_REPOSITORY,
    ReportAnalyticsRepositoryPort,
} from '../ports/report-analytics.repository.port';
import {
    REPORT_REPOSITORY,
    ReportRepositoryPort,
} from '../ports/report.repository.port';
import {
    STRATEGIC_REPORT_ANALYTICS_REPOSITORY,
    StrategicReportAnalyticsRepositoryPort,
} from '../ports/strategic-report-analytics.repository.port';
import {
    STRATEGIC_REPORT_INSIGHT_REPOSITORY,
    StrategicReportInsightRepositoryPort,
} from '../ports/strategic-report-insight.repository.port';
import {
    STRATEGIC_REPORT_REPOSITORY,
    StrategicReportRepositoryPort,
} from '../ports/strategic-report.repository.port';

@Injectable()
export class StrategicReportingService {
    private readonly logger = new Logger(StrategicReportingService.name);

    constructor(
        @Inject(STRATEGIC_REPORT_REPOSITORY)
        private readonly strategicReports: StrategicReportRepositoryPort,
        @Inject(STRATEGIC_REPORT_ANALYTICS_REPOSITORY)
        private readonly strategicAnalyticsRepo: StrategicReportAnalyticsRepositoryPort,
        @Inject(RESPONDENT_REPOSITORY)
        private readonly respondents: RespondentRepositoryPort,
        @Inject(REVIEWER_REPOSITORY)
        private readonly reviewers: ReviewerRepositoryPort,
        @Inject(ANSWER_REPOSITORY)
        private readonly answers: AnswerRepositoryPort,
        @Inject(REVIEW_REPOSITORY)
        private readonly reviews: ReviewRepositoryPort,
        @Inject(CYCLE_REPOSITORY)
        private readonly cyclesRepo: CycleRepositoryPort,
        @Inject(REPORT_REPOSITORY)
        private readonly reports: ReportRepositoryPort,
        @Inject(IDENTITY_USER_REPOSITORY)
        private readonly users: UserRepositoryPort,
        @Inject(ORGANISATION_TEAM_REPOSITORY)
        private readonly teams: TeamRepositoryPort,
        @Inject(ORGANISATION_POSITION_REPOSITORY)
        private readonly positions: PositionRepositoryPort,
        @Inject(COMPETENCE_REPOSITORY)
        private readonly competences: CompetenceRepositoryPort,
        @Inject(QUESTION_REPOSITORY)
        private readonly questions: QuestionRepositoryPort,
        @Inject(REPORT_ANALYTICS_REPOSITORY)
        private readonly reportAnalyticsRepo: ReportAnalyticsRepositoryPort,
        @Inject(STRATEGIC_REPORT_INSIGHT_REPOSITORY)
        private readonly insightsRepo: StrategicReportInsightRepositoryPort,
    ) {}

    async search(
        query: StrategicReportSearchQuery,
        actor?: UserDomain,
    ): Promise<StrategicReportDomain[]> {
        await this.checkAccessToAllStrategicReports(actor);
        return await this.strategicReports.search(query);
    }

    /**
     * Checks if the actor has access to all strategic reports (HR or Admin only).
     * @param actor The actor to check access for.
     */
    async checkAccessToAllStrategicReports(actor?: UserDomain): Promise<void> {
        if (!actor) return;

        const isAdminOrHr =
            actor?.roles?.includes(IdentityRole.ADMIN) ||
            actor?.roles?.includes(IdentityRole.HR);

        if (!isAdminOrHr) {
            throw new ForbiddenException(
                'You do not have permission to view strategic reports',
            );
        }
    }

    async getById(
        id: number,
        actor?: UserDomain,
    ): Promise<StrategicReportDomain> {
        const report = await this.strategicReports.findById(id);

        if (!report) {
            throw new NotFoundException(
                `Strategic report with id ${id} was not found`,
            );
        }

        await this.checkAccessToStrategicReport(report, actor);

        return report;
    }

    /**
     * Checks if the actor has access to the strategic report.
     * @param report The strategic report to check access for.
     * @param actor The actor to check access for.
     */
    async checkAccessToStrategicReport(
        report: StrategicReportDomain,
        actor?: UserDomain,
    ): Promise<void> {
        if (!actor) return;

        const isAdminOrHr =
            actor?.roles?.includes(IdentityRole.ADMIN) ||
            actor?.roles?.includes(IdentityRole.HR);

        if (isAdminOrHr) return;

        const reviews = await this.reviews.search({ cycleId: report.cycleId });

        if (!reviews || reviews.length === 0) {
            throw new NotFoundException(`Reviews for strategic report ${report.id} was not found.
                Unable to check access to strategic report`);
        }

        const isManagerOfReview = reviews.some(
            (review) => review.managerId === actor.id,
        );

        if (isManagerOfReview) return;

        throw new ForbiddenException(
            'You do not have permission to view this strategic report',
        );
    }

    async getByCycleId(
        cycleId: number,
        actor?: UserDomain,
    ): Promise<StrategicReportDomain> {
        const report = await this.strategicReports.findByCycleId(cycleId);
        if (!report) {
            throw new NotFoundException(
                `Report for cycle ${cycleId} was not found`,
            );
        }

        await this.checkAccessToStrategicReport(report, actor);

        return report;
    }

    /**
     * Generates a comprehensive strategic report for a feedback360 cycle.
     * @param cycleId The ID of the cycle to generate a report for.
     * @returns The generated report.
     */
    async generateStrategicReportForCycle(
        cycleId: number,
    ): Promise<StrategicReportDomain> {
        this.logger.debug(`Starting report generation for cycle ${cycleId}`);

        const cycle = await this.cyclesRepo.findById(cycleId);
        if (!cycle) {
            throw new NotFoundException(`Cycle ${cycleId} not found`);
        }

        const existing = await this.strategicReports.findByCycleId(cycleId);
        if (existing) {
            this.logger.debug(`Report already exists for cycle ${cycleId}`);
            return existing;
        }

        const reports = await this.reports.search({ cycleId });
        if (!reports || reports.length === 0) {
            throw new NotFoundException(
                `Reports for cycle ${cycleId} not found`,
            );
        }

        const allReviews = new Set<ReviewDomain>();
        const reviewIds = new Set<number>();

        const turnouts: {
            reportId: number;
            rateeTurnout: Decimal;
            teamTurnout: Decimal;
            otherTurnout: Decimal;
        }[] = [];

        for (const report of reports) {
            const review = await this.reviews.findById(report.reviewId);
            if (review) {
                allReviews.add(review);
                reviewIds.add(review.id!);
            }

            turnouts.push({
                reportId: report.id!,
                rateeTurnout: new Decimal(0),
                teamTurnout: report.turnoutPctOfTeam
                    ? new Decimal(report.turnoutPctOfTeam)
                    : new Decimal(0),
                otherTurnout: report.turnoutPctOfOther
                    ? new Decimal(report.turnoutPctOfOther)
                    : new Decimal(0),
            });
        }

        const allRatees = new Set<UserDomain>();
        const allRespondents = new Set<RespondentDomain>();
        const allAnswers = new Set<AnswerDomain>();
        const actualAnswersByCategory: Record<string, Decimal> = {
            [RespondentCategory.SELF_ASSESSMENT]: new Decimal(0),
            [RespondentCategory.TEAM]: new Decimal(0),
            [RespondentCategory.OTHER]: new Decimal(0),
        };
        const allReviewers = new Set<ReviewerDomain>();
        const allTeams = new Map<number, TeamDomain>();
        const allPositions = new Map<number, PositionDomain>();
        const allCompetences = new Map<number, CompetenceDomain>();
        const allQuestions = new Map<number, QuestionDomain>();

        for (const review of allReviews) {
            const teamIds = new Set<number>();
            const positionIds = new Set<number>();
            const competenceIds = new Set<number>();
            const questionIds = new Set<number>();

            const ratee = await this.users.findById(review.rateeId);
            if (ratee) {
                allRatees.add(ratee);

                if (ratee.teamId) {
                    teamIds.add(ratee.teamId);
                }

                if (ratee.positionId) {
                    positionIds.add(ratee.positionId);
                }
            }

            const respondents = await this.respondents.listByReview(
                review.id!,
                {},
            );
            respondents.forEach((respondent) => {
                allRespondents.add(respondent);

                if (respondent.teamId) {
                    teamIds.add(respondent.teamId);
                }
            });

            for (const teamId of teamIds) {
                if (!allTeams.has(teamId)) {
                    const team = await this.teams.findById(teamId);
                    if (team) {
                        allTeams.set(teamId, team);
                    }
                }
            }

            for (const positionId of positionIds) {
                if (!allPositions.has(positionId)) {
                    const position = await this.positions.findById(positionId);
                    if (position) {
                        allPositions.set(positionId, position);
                    }
                }
            }

            const answers = await this.answers.list({
                reviewId: review.id!,
            });

            answers.forEach((answer) => {
                allAnswers.add(answer);

                if (answer.questionId) {
                    questionIds.add(answer.questionId);
                }
            });

            const answersCounts =
                await this.answers.getAnswersCountByRespondentCategories(
                    review.id!,
                );

            answersCounts.forEach((stat) => {
                if (
                    actualAnswersByCategory[stat.respondentCategory] !==
                    undefined
                ) {
                    actualAnswersByCategory[stat.respondentCategory] =
                        actualAnswersByCategory[stat.respondentCategory].plus(
                            stat.answers,
                        );
                }
            });

            const selfAssessmentStat = answersCounts.find(
                (stat) =>
                    stat.respondentCategory ===
                    RespondentCategory.SELF_ASSESSMENT,
            );
            const hasSelfAssessment =
                selfAssessmentStat && selfAssessmentStat.answers > 0;
            const currentTurnout = turnouts.find(
                (t) => t.reportId === review.reportId,
            );
            if (currentTurnout) {
                currentTurnout.rateeTurnout = hasSelfAssessment
                    ? new Decimal(100)
                    : new Decimal(0);
            }

            for (const questionId of questionIds) {
                if (!allQuestions.has(questionId)) {
                    const question = await this.questions.findById(questionId);
                    if (question) {
                        allQuestions.set(questionId, question);
                    }
                }
                const q = allQuestions.get(questionId);
                if (q && q.competenceId) {
                    competenceIds.add(q.competenceId);
                }
            }

            for (const competenceId of competenceIds) {
                if (!allCompetences.has(competenceId)) {
                    const competence =
                        await this.competences.findById(competenceId);
                    if (competence) {
                        allCompetences.set(competenceId, competence);
                    }
                }
            }

            const reviewers = await this.reviewers.listByReview(review.id!, {});
            reviewers.forEach((reviewer) => allReviewers.add(reviewer));
        }

        const allReportAnalytics = await Promise.all(
            reports.map(async (report) => {
                return {
                    reportId: report.id!,
                    reportAnalytics:
                        await this.reportAnalyticsRepo.findByReportId(
                            report.id!,
                        ),
                };
            }),
        );

        const maxScore = new Decimal(REPORT_ANALYTICS_CONSTRAINTS.SCORE.MAX);
        const competenceAnalytics = this.buildStrategicAnalyticPayload(
            allReportAnalytics,
            maxScore,
            Array.from(allCompetences.values()),
        );
        const competenceTotals = this.calculateCompetenceSummaryTotals(
            competenceAnalytics,
            maxScore,
        );

        const allRateeIds = [
            ...new Set<number>([...allRatees].map((r) => r.id!)),
        ].sort((a, b) => a - b);
        const allRespondentIds = [
            ...new Set<number>([...allRespondents].map((r) => r.respondentId!)),
        ].sort((a, b) => a - b);
        let allAnswerCount = new Decimal(0);
        Object.values(actualAnswersByCategory).forEach((count) => {
            allAnswerCount = allAnswerCount.plus(count);
        });
        const allReviewerIds = [
            ...new Set<number>([...allReviewers].map((r) => r.reviewerId!)),
        ].sort((a, b) => a - b);
        const allTeamIds = Array.from(allTeams.keys()).sort((a, b) => a - b);
        const allPositionIds = Array.from(allPositions.keys()).sort(
            (a, b) => a - b,
        );
        const allCompetenceIds = Array.from(allCompetences.keys()).sort(
            (a, b) => a - b,
        );
        const allQuestionIds = Array.from(allQuestions.keys()).sort(
            (a, b) => a - b,
        );

        const rateeTurnout = turnouts
            .reduce((acc, t) => acc.plus(t.rateeTurnout), new Decimal(0))
            .dividedBy(turnouts.length);
        const teamTurnout = turnouts
            .reduce((acc, t) => acc.plus(t.teamTurnout), new Decimal(0))
            .dividedBy(turnouts.length);
        const otherTurnout = turnouts
            .reduce((acc, t) => acc.plus(t.otherTurnout), new Decimal(0))
            .dividedBy(turnouts.length);

        const report = StrategicReportDomain.create({
            cycleId: cycleId,
            cycleTitle: cycle.title,
            rateeCount: allRateeIds.length,
            rateeIds: allRateeIds,
            respondentCount: allRespondentIds.length,
            respondentIds: allRespondentIds,
            answerCount: allAnswerCount.toNumber(),
            reviewerCount: allReviewerIds.length,
            reviewerIds: allReviewerIds,
            teamCount: allTeamIds.length,
            teamIds: allTeamIds,
            positionCount: allPositionIds.length,
            positionIds: allPositionIds,
            competenceCount: allCompetenceIds.length,
            competenceIds: allCompetenceIds,
            questionCount: allQuestionIds.length,
            questionIds: allQuestionIds,
            turnoutAvgPctOfRatees: rateeTurnout,
            turnoutAvgPctOfTeams: teamTurnout,
            turnoutAvgPctOfOthers: otherTurnout,
            competenceGeneralAvgSelf: competenceTotals.averageBySelfAssessment,
            competenceGeneralAvgTeam: competenceTotals.averageByTeam,
            competenceGeneralAvgOther: competenceTotals.averageByOther,
            competenceGeneralPctSelf:
                competenceTotals.percentageBySelfAssessment,
            competenceGeneralPctTeam: competenceTotals.percentageByTeam,
            competenceGeneralPctOther: competenceTotals.percentageByOther,
            competenceGeneralDeltaTeam: competenceTotals.deltaPercentageByTeam,
            competenceGeneralDeltaOther:
                competenceTotals.deltaPercentageByOther,
            analytics: [],
        });

        const createdReport = await this.strategicReports.create(report);

        await this.strategicAnalyticsRepo.createMany(createdReport.id!, [
            ...competenceAnalytics,
        ]);

        this.logger.debug(
            `Generated ${competenceAnalytics.length} strategic report analytics for report ${createdReport.id}`,
        );

        const competenceInsights = await this.calculateEntityInsights(
            competenceAnalytics,
            createdReport.id!,
        );

        await this.insightsRepo.createMany(createdReport.id!, [
            ...competenceInsights,
        ]);

        this.logger.debug(
            `Generated ${competenceInsights.length} competence insights`,
        );

        const fullReport = await this.strategicReports.findById(
            createdReport.id!,
        );
        if (!fullReport) {
            throw new NotFoundException(
                `Strategic report ${createdReport.id} could not be loaded after creation`,
            );
        }

        this.logger.debug(
            `Successfully created strategic report ${fullReport.id} for cycle ${cycleId}`,
        );

        return fullReport;
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
     * Calculates the turnout percentage of respondents.
     * Formula: (actual answers / assigned respondents) * 100
     * @param respondentCount The count of all assigned respondents.
     * @param actualAnswers The count of actual answers for the category.
     * @returns The turnout percentage as a Decimal.
     */
    private calculateTurnout(
        respondentCount: Decimal,
        actualAnswers: Decimal,
    ): Decimal {
        if (actualAnswers?.equals(0)) {
            return new Decimal(0);
        }

        const turnout = actualAnswers.dividedBy(respondentCount).times(100);

        return this.roundDecimal(turnout) ?? new Decimal(0);
    }

    /**
     * Builds the strategic analytics payload for a report, calculating averages
     * and percentages for competences from all reports.
     * @param reportAnalytics The report analytics for each report.
     * @param maxScore The maximum score for the competences.
     * @param allCompetences The list of all rated competences.
     * @returns An object containing competence analytics.
     */
    private buildStrategicAnalyticPayload(
        reportAnalytics: {
            reportId: number;
            reportAnalytics: ReportAnalyticsDomain[];
        }[],
        maxScore: Decimal,
        allCompetences: CompetenceDomain[],
    ): StrategicReportAnalyticsDomain[] {
        const competenceAnalytics: StrategicReportAnalyticsDomain[] = [];

        for (const competence of allCompetences) {
            const currentCompetenceScores: ReportAnalyticsDomain[] = [];
            reportAnalytics.forEach((r) => {
                r.reportAnalytics?.forEach((a) => {
                    if (a.competenceId === competence.id) {
                        currentCompetenceScores.push(a);
                    }
                });
            });

            const averageBySelf = this.calculateAverage(
                currentCompetenceScores.map((a) => a.averageBySelfAssessment),
            );
            const averageByTeam = this.calculateAverage(
                currentCompetenceScores.map((a) => a.averageByTeam),
            );
            const averageByOther = this.calculateAverage(
                currentCompetenceScores.map((a) => a.averageByOther),
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

            const deltaPercentageByTeam = this.calculateDelta(
                percentageByTeam,
                percentageBySelf,
            );
            const deltaPercentageByOther = this.calculateDelta(
                percentageByOther,
                percentageBySelf,
            );

            competenceAnalytics.push(
                StrategicReportAnalyticsDomain.create({
                    strategicReportId: 0,
                    competenceId: competence.id!,
                    competenceTitle: competence.title!,
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

        return competenceAnalytics;
    }

    /**
     * Calculates the summary totals for all rated competences.
     * @param strategicAnalytics The strategic analytics for the competences.
     * @param maxScore The maximum score.
     * @returns The summary competence totals.
     */
    private calculateCompetenceSummaryTotals(
        strategicAnalytics: StrategicReportAnalyticsDomain[],
        maxScore: Decimal,
    ): EntitySummaryTotals {
        const averageBySelf = this.calculateAverage(
            strategicAnalytics.map((item) => item.averageBySelfAssessment),
        );
        const averageByTeam = this.calculateAverage(
            strategicAnalytics.map((item) => item.averageByTeam),
        );
        const averageByOther = this.calculateAverage(
            strategicAnalytics.map((item) => item.averageByOther),
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

        const deltaPercentageByTeam = this.calculateDelta(
            percentageByTeam,
            percentageBySelf,
        );
        const deltaPercentageByOther = this.calculateDelta(
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
     * Calculates the difference between two values in percentage points.
     * Formula: respondent rating - self rating.
     * @param respondent The respondent rating.
     * @param self The self rating.
     * @returns The difference in percentage points.
     */
    private calculateDelta(
        respondent: Decimal | null,
        self: Decimal | null,
    ): Decimal | null {
        if (respondent === null || self === null) {
            return null;
        }

        return this.roundDecimal(respondent.minus(self));
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
     * Calculates the metrics insights for entities (questions or competences).
     * @param entities The entities to calculate the metrics insights for.
     * @param type The type of entities (question or competence).
     * @param reportId The ID of the report.
     * @returns The metrics insights.
     */
    private calculateEntityInsights(
        entities: StrategicReportAnalyticsDomain[],
        strategicReportId: number,
    ): StrategicReportInsightDomain[] {
        const averages: EntityAverageInsightsDto[] = [...entities]
            .sort((a, b) => {
                const nameA = a.competenceTitle ?? '';
                const nameB = b.competenceTitle ?? '';
                return nameA.localeCompare(nameB);
            })
            .map((entity, index) => {
                return {
                    entityId: entity.competenceId,
                    entityType: EntityType.COMPETENCE,
                    entityTitle: entity.competenceTitle,
                    questionId: null,
                    questionTitle: null,
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

        const insights: StrategicReportInsightDomain[] = [];

        insights.push(
            StrategicReportInsightDomain.create({
                strategicReportId: strategicReportId!,
                insightType: InsightType.HIGHEST_RATING,
                competenceId: insightSummaries.highestRating?.entityId ?? -1,
                competenceTitle:
                    insightSummaries.highestRating?.entityTitle ?? '',
                averageScore: insightSummaries.highestRating?.averageScore,
                averageRating: insightSummaries.highestRating?.averageRating,
                averageDelta: insightSummaries.highestRating?.averageDelta,
                createdAt: undefined,
            }),
        );

        insights.push(
            StrategicReportInsightDomain.create({
                strategicReportId: strategicReportId!,
                insightType: InsightType.LOWEST_RATING,
                competenceId: insightSummaries.lowestRating?.entityId ?? -1,
                competenceTitle:
                    insightSummaries.lowestRating?.entityTitle ?? '',
                averageScore: insightSummaries.lowestRating?.averageScore,
                averageRating: insightSummaries.lowestRating?.averageRating,
                averageDelta: insightSummaries.lowestRating?.averageDelta,
                createdAt: undefined,
            }),
        );

        insights.push(
            StrategicReportInsightDomain.create({
                strategicReportId: strategicReportId!,
                insightType: InsightType.HIGHEST_DELTA,
                competenceId: insightSummaries.highestDelta?.entityId ?? -1,
                competenceTitle:
                    insightSummaries.highestDelta?.entityTitle ?? '',
                averageScore: insightSummaries.highestDelta?.averageScore,
                averageRating: insightSummaries.highestDelta?.averageRating,
                averageDelta: insightSummaries.highestDelta?.averageDelta,
                createdAt: undefined,
            }),
        );

        insights.push(
            StrategicReportInsightDomain.create({
                strategicReportId: strategicReportId!,
                insightType: InsightType.LOWEST_DELTA,
                competenceId: insightSummaries.lowestDelta?.entityId ?? -1,
                competenceTitle:
                    insightSummaries.lowestDelta?.entityTitle ?? '',
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
