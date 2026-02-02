import { ReportCommentDomain } from '../../domain/report-comment.domain';

export const REPORT_COMMENT_REPOSITORY = Symbol(
    'REPORTING.REPORT_COMMENT_REPOSITORY',
);

export interface ReportCommentRepositoryPort {
    findByReportId(reportId: number): Promise<ReportCommentDomain[]>;
    findById(id: number): Promise<ReportCommentDomain | null>;
}
