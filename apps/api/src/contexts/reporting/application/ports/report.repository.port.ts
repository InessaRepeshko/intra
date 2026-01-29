import { ReportDomain } from '../../domain/report.domain';

export const REPORT_REPOSITORY = Symbol('REPORTING.REPORT_REPOSITORY');

export interface ReportRepositoryPort {
    findByReviewId(reviewId: number): Promise<ReportDomain | null>;
}
