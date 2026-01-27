import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CycleClusterAnalyticsDomain } from '../../domain/cycle-cluster-analytics.domain';
import {
    CYCLE_CLUSTER_ANALYTICS_REPOSITORY,
    CycleClusterAnalyticsRepositoryPort,
} from '../ports/cycle-cluster-analytics.repository.port';
import { CycleService } from './cycle.service';
import { CycleClusterAnalyticsSearchQuery, UpdateCycleClusterAnalyticsPayload, UpsertCycleClusterAnalyticsPayload } from '@intra/shared-kernel';

@Injectable()
export class CycleClusterAnalyticsService {
    constructor(
        @Inject(CYCLE_CLUSTER_ANALYTICS_REPOSITORY)
        private readonly analytics: CycleClusterAnalyticsRepositoryPort,
        private readonly cycles: CycleService,
    ) { }

    async upsert(payload: UpsertCycleClusterAnalyticsPayload): Promise<CycleClusterAnalyticsDomain> {
        await this.cycles.getById(payload.cycleId);
        await this.validateScores(payload.minScore, payload.maxScore, payload.averageScore);

        const domain = CycleClusterAnalyticsDomain.create({
            cycleId: payload.cycleId,
            clusterId: payload.clusterId,
            employeesCount: payload.employeesCount,
            minScore: payload.minScore,
            maxScore: payload.maxScore,
            averageScore: payload.averageScore,
        });

        return this.analytics.upsert(domain);
    }

    async search(query: CycleClusterAnalyticsSearchQuery): Promise<CycleClusterAnalyticsDomain[]> {
        return this.analytics.search(query);
    }

    async getById(id: number): Promise<CycleClusterAnalyticsDomain> {
        const item = await this.analytics.findById(id);
        if (!item) throw new NotFoundException('Cycle cluster analytics not found');
        return item;
    }

    async update(id: number, patch: UpdateCycleClusterAnalyticsPayload): Promise<CycleClusterAnalyticsDomain> {
        const current = await this.getById(id);

        const minScore = patch.minScore ?? current.minScore;
        const maxScore = patch.maxScore ?? current.maxScore;
        const averageScore = patch.averageScore ?? current.averageScore;

        await this.validateScores(minScore, maxScore, averageScore);

        const payload: UpdateCycleClusterAnalyticsPayload = {
            ...(patch.employeesCount !== undefined ? { employeesCount: patch.employeesCount } : {}),
            ...(patch.minScore !== undefined ? { minScore: patch.minScore } : {}),
            ...(patch.maxScore !== undefined ? { maxScore: patch.maxScore } : {}),
            ...(patch.averageScore !== undefined ? { averageScore: patch.averageScore } : {}),
        };

        return this.analytics.updateById(id, payload);
    }

    async delete(id: number): Promise<void> {
        await this.getById(id);
        await this.analytics.deleteById(id);
    }

    private async validateScores(min: number, max: number, avg: number): Promise<void> {
        if (min > max) {
            throw new BadRequestException('Min score must be less than or equal to max score');
        }
        if (avg < min || avg > max) {
            throw new BadRequestException('Average score must be between min and max scores');
        }
    }
}
