import { EntityType } from '@intra/shared-kernel';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
    CLUSTER_SCORE_REPOSITORY,
    ClusterScoreRepositoryPort,
} from '../../../feedback360/application/ports/cluster-score.repository.port';
import {
    RESPONDENT_REPOSITORY,
    RespondentRepositoryPort,
} from '../../../feedback360/application/ports/respondent.repository.port';
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
        @Inject(CLUSTER_SCORE_REPOSITORY)
        private readonly clusterScores: ClusterScoreRepositoryPort,
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
     * Calculates respondent counts and generates cluster-based analytics
     */
    async generateReportForReview(reviewId: number): Promise<ReportDomain> {
        this.logger.log(`Starting report generation for review ${reviewId}`);

        // Check if report already exists
        const existing = await this.reports.findByReviewId(reviewId);
        if (existing) {
            this.logger.log(`Report already exists for review ${reviewId}`);
            return existing;
        }

        // Step 1: Calculate respondent counts
        const allRespondents = await this.respondents.listByReview(
            reviewId,
            {},
        );
        const respondentCount = allRespondents.length;

        // Count by category (assuming TEAM vs OTHER based on isDirectReport or similar field)
        // For simplified version, we'll leave turnout calculations as 0
        const turnoutOfTeam = 0;
        const turnoutOfOther = 0;

        this.logger.log(
            `Calculated respondent counts: ${respondentCount} total`,
        );

        // Step 2: Generate cluster-based analytics
        const scores = await this.clusterScores.list({ reviewId });
        const analyticsData = this.generateClusterAnalytics(scores);

        // Calculate report-level averages from all cluster scores
        const allScores = scores.map((s) => s.score);
        const overallAverage = this.calculateAverage(allScores);

        this.logger.log(
            `Generated analytics for ${analyticsData.length} clusters`,
        );

        // Create report with calculated data
        const report = ReportDomain.create({
            reviewId,
            respondentCount,
            turnoutOfTeam,
            turnoutOfOther,
            totalAverageBySelfAssessment: null, // Would need respondent category info
            totalAverageByTeam: overallAverage,
            totalAverageByOthers: null,
            totalDeltaBySelfAssessment: null,
            totalDeltaByTeam: null,
            totalDeltaByOthers: null,
            analytics: analyticsData,
            comments: [], // Comments will be added separately if needed
        });

        // Persist report
        const created = await this.reports.create(report);
        this.logger.log(
            `Successfully created report ${created.id} for review ${reviewId}`,
        );

        return created;
    }

    /**
     * Generates analytics from cluster scores
     * Groups by cluster and calculates averages
     */
    private generateClusterAnalytics(scores: any[]): ReportAnalyticsDomain[] {
        // Group scores by cluster
        const scoresByCluster = scores.reduce((acc, score) => {
            const clusterId = score.clusterId;
            if (!acc[clusterId]) {
                acc[clusterId] = {
                    scores: [],
                    clusterTitle:
                        score.cluster?.title || `Cluster ${clusterId}`,
                    competenceId: score.cluster?.competenceId || null,
                    competenceTitle: score.cluster?.competence?.title || null,
                };
            }
            acc[clusterId].scores.push(score.score);
            return acc;
        }, {});

        // Generate analytics for each cluster
        const analytics: ReportAnalyticsDomain[] = [];

        for (const [clusterIdStr, data] of Object.entries(scoresByCluster)) {
            const clusterId = Number(clusterIdStr);
            const {
                scores: clusterScores,
                clusterTitle,
                competenceId,
                competenceTitle,
            } = data as any;

            const average = this.calculateAverage(clusterScores);
            const baseline = 5.0; // Expected baseline score
            const delta = average !== null ? average - baseline : null;

            analytics.push(
                ReportAnalyticsDomain.create({
                    reportId: 0, // Will be set when persisted
                    entityType: EntityType.COMPETENCE,
                    questionId: null,
                    questionTitle: clusterTitle,
                    competenceId: competenceId,
                    competenceTitle: competenceTitle,
                    averageBySelfAssessment: null, // Would need category breakdown
                    averageByTeam: this.round(average),
                    averageByOther: null,
                    deltaBySelfAssessment: null,
                    deltaByTeam: this.round(delta),
                    deltaByOther: null,
                }),
            );
        }

        return analytics.sort((a, b) => {
            const aId = a.competenceId || 0;
            const bId = b.competenceId || 0;
            return aId - bId;
        });
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
}
