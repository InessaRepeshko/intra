import { ReportSearchQuery } from '@intra/shared-kernel';
import { ReportDomain } from '../../domain/report.domain';

export const REPORT_REPOSITORY = Symbol('REPORTING.REPORT_REPOSITORY');

export interface ReportRepositoryPort {
    create(report: ReportDomain): Promise<ReportDomain>;
    findById(id: number): Promise<ReportDomain | null>;
    findByReviewId(reviewId: number): Promise<ReportDomain | null>;
    search(query: ReportSearchQuery): Promise<ReportDomain[]>;
}
