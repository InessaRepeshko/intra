import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    REPORT_COMMENT_REPOSITORY,
    ReportCommentRepositoryPort,
} from '../ports/report-comment.repository.port';
import { ReportCommentDomain } from '../../domain/report-comment.domain';

@Injectable()
export class ReportCommentService {
    constructor(
        @Inject(REPORT_COMMENT_REPOSITORY)
        private readonly comments: ReportCommentRepositoryPort,
    ) { }

    async getByReportId(reportId: number): Promise<ReportCommentDomain[]> {
        return this.comments.findByReportId(reportId);
    }

    async getById(id: number): Promise<ReportCommentDomain> {
        const comment = await this.comments.findById(id);
        if (!comment) {
            throw new NotFoundException(
                `Report comment with id ${id} was not found`,
            );
        }

        return comment;
    }
}
