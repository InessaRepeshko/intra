import {
    CLUSTER_SCORE_ANALYTICS_CONSTRAINTS,
    ClusterScoreAnalyticsSearchQuery,
    UpdateClusterScoreAnalyticsPayload,
    UpsertClusterScoreAnalyticsPayload,
} from '@intra/shared-kernel';
import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import Decimal from 'decimal.js';
import { ClusterService } from '../../../library/application/services/cluster.service';
import { ClusterScoreAnalyticsDomain } from '../../domain/cluster-score-analytics.domain';
import {
    CLUSTER_SCORE_ANALYTICS_REPOSITORY,
    ClusterScoreAnalyticsRepositoryPort,
} from '../ports/cluster-score-analytics.repository.port';
import {
    CLUSTER_SCORE_REPOSITORY,
    ClusterScoreRepositoryPort,
} from '../ports/cluster-score.repository.port';
import { CycleService } from './cycle.service';

@Injectable()
export class ClusterScoreAnalyticsService {
    constructor(
        @Inject(CLUSTER_SCORE_ANALYTICS_REPOSITORY)
        private readonly analytics: ClusterScoreAnalyticsRepositoryPort,
        @Inject(CLUSTER_SCORE_REPOSITORY)
        private readonly clusterScores: ClusterScoreRepositoryPort,
        private readonly cycles: CycleService,
        private readonly clusters: ClusterService,
    ) {}

    async upsert(
        payload: UpsertClusterScoreAnalyticsPayload,
    ): Promise<ClusterScoreAnalyticsDomain> {
        await this.cycles.getById(payload.cycleId);
        const minScore = new Decimal(payload.minScore);
        const maxScore = new Decimal(payload.maxScore);
        const averageScore = new Decimal(payload.averageScore);
        const lowerBound = new Decimal(payload.lowerBound);
        const upperBound = new Decimal(payload.upperBound);

        await this.validateBounds(lowerBound, upperBound);
        await this.validateScores(minScore, maxScore, averageScore);

        const domain = ClusterScoreAnalyticsDomain.create({
            cycleId: payload.cycleId,
            clusterId: payload.clusterId,
            employeesCount: payload.employeesCount,
            employeeDensity: payload.employeeDensity,
            lowerBound,
            upperBound,
            minScore,
            maxScore,
            averageScore,
        });

        return this.analytics.upsert(domain);
    }

    async search(
        query: ClusterScoreAnalyticsSearchQuery,
    ): Promise<ClusterScoreAnalyticsDomain[]> {
        return this.analytics.search(query);
    }

    async getById(id: number): Promise<ClusterScoreAnalyticsDomain> {
        const item = await this.analytics.findById(id);
        if (!item)
            throw new NotFoundException('Cycle cluster analytics not found');
        return item;
    }

    async update(
        id: number,
        patch: UpdateClusterScoreAnalyticsPayload,
    ): Promise<ClusterScoreAnalyticsDomain> {
        const current = await this.getById(id);

        const minScore =
            patch.minScore !== undefined
                ? new Decimal(patch.minScore)
                : current.minScore;
        const maxScore =
            patch.maxScore !== undefined
                ? new Decimal(patch.maxScore)
                : current.maxScore;
        const averageScore =
            patch.averageScore !== undefined
                ? new Decimal(patch.averageScore)
                : current.averageScore;

        await this.validateScores(minScore, maxScore, averageScore);

        const payload: UpdateClusterScoreAnalyticsPayload = {
            ...(patch.employeesCount !== undefined
                ? { employeesCount: patch.employeesCount }
                : {}),
            ...(patch.employeeDensity !== undefined
                ? { employeeDensity: patch.employeeDensity }
                : {}),
            ...(patch.minScore !== undefined
                ? { minScore: patch.minScore }
                : {}),
            ...(patch.maxScore !== undefined
                ? { maxScore: patch.maxScore }
                : {}),
            ...(patch.averageScore !== undefined
                ? { averageScore: patch.averageScore }
                : {}),
        };

        return this.analytics.updateById(id, payload);
    }

    async delete(id: number): Promise<void> {
        await this.getById(id);
        await this.analytics.deleteById(id);
    }

    async getByCycleId(
        cycleId: number,
    ): Promise<ClusterScoreAnalyticsDomain[]> {
        return this.analytics.getByCycleId(cycleId);
    }

    /**
     * Generates analytics metrics for a cycle.
     * @param cycleId The cycle identifier.
     */
    async generateAnalyticsForCycle(cycleId: number): Promise<void> {
        await this.cycles.getById(cycleId);

        const clusters = await this.clusters.search({});
        const clusterScores = await this.clusterScores.list({
            cycleId,
        });

        for (const cluster of clusters) {
            if (!cluster.id) {
                continue;
            }

            const currentClusterScores = clusterScores.filter(
                (cs) => cs.clusterId === cluster.id,
            );

            if (!currentClusterScores.length) {
                continue;
            }

            const scores = currentClusterScores.map(
                (cs) => new Decimal(cs.score),
            );
            const minScore = Decimal.min(...scores).toDecimalPlaces(4);
            const maxScore = Decimal.max(...scores).toDecimalPlaces(4);
            const averageScore = scores
                .reduce((a, b) => a.plus(b), new Decimal(0))
                .dividedBy(scores.length)
                .toDecimalPlaces(4);
            const employeesCount = currentClusterScores.length;

            const competenceClusterIds = clusters
                .filter((c) => c.competenceId === cluster.competenceId)
                .map((c) => c.id);
            const rateesByCompetence = new Set(
                clusterScores
                    .filter((cs) => competenceClusterIds.includes(cs.clusterId))
                    .map((cs) => cs.rateeId),
            );
            const employeeDensity = new Decimal(currentClusterScores.length)
                .dividedBy(rateesByCompetence.size)
                .toDecimalPlaces(4);

            const lowerBound = new Decimal(cluster.lowerBound);
            const upperBound = new Decimal(cluster.upperBound);

            await this.validateBounds(lowerBound, upperBound);
            await this.validateScores(minScore, maxScore, averageScore);

            const domain = ClusterScoreAnalyticsDomain.create({
                cycleId,
                clusterId: cluster.id,
                employeesCount,
                employeeDensity,
                lowerBound,
                upperBound,
                minScore,
                maxScore,
                averageScore,
            });

            await this.analytics.upsert(domain);
        }
    }

    /**
     * Validates the scores for a cluster.
     * @param min The minimum score.
     * @param max The maximum score.
     * @param avg The average score.
     */
    private async validateScores(
        min: Decimal,
        max: Decimal,
        avg: Decimal,
    ): Promise<void> {
        if (min.gt(max)) {
            throw new BadRequestException(
                'Min score must be less than or equal to max score',
            );
        }
        if (avg.lt(min) || avg.gt(max)) {
            throw new BadRequestException(
                'Average score must be between min and max scores',
            );
        }
    }

    /**
     * Validates the bounds for a cluster.
     * @param lower The lower bound.
     * @param upper The upper bound.
     */
    private async validateBounds(
        lower: Decimal,
        upper: Decimal,
    ): Promise<void> {
        if (lower.lt(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MIN)) {
            throw new BadRequestException(
                'Lower bound must be greater than or equal to min score',
            );
        }
        if (upper.gt(CLUSTER_SCORE_ANALYTICS_CONSTRAINTS.SCORE.MAX)) {
            throw new BadRequestException(
                'Upper bound must be less than or equal to max score',
            );
        }
        if (lower.gt(upper)) {
            throw new BadRequestException(
                'Lower bound must be less than or equal to upper bound',
            );
        }
    }
}
