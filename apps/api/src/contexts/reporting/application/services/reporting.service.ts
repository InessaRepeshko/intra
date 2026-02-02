import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    REPORT_REPOSITORY,
    ReportRepositoryPort,
} from '../ports/report.repository.port';
import { ReportDomain } from '../../domain/report.domain';

@Injectable()
export class ReportingService {
    constructor(
        @Inject(REPORT_REPOSITORY)
        private readonly reports: ReportRepositoryPort,
    ) { }

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
}
