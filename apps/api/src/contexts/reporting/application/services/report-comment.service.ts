import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { ReportCommentDomain } from '../../domain/report-comment.domain';
import {
    REPORT_COMMENT_REPOSITORY,
    ReportCommentRepositoryPort,
} from '../ports/report-comment.repository.port';
import { ReportingService } from './reports.service';

@Injectable()
export class ReportCommentService {
    constructor(
        @Inject(REPORT_COMMENT_REPOSITORY)
        private readonly comments: ReportCommentRepositoryPort,
        private readonly reportingService: ReportingService,
    ) {}

    async getByReportId(
        reportId: number,
        actor?: UserDomain,
    ): Promise<ReportCommentDomain[]> {
        await this.reportingService.getById(reportId, actor);

        const comments = await this.comments.findByReportId(reportId);

        if (!comments || comments.length === 0) {
            throw new NotFoundException(
                `Report comments with report id ${reportId} were not found`,
            );
        }

        return comments;
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

    async create(comment: ReportCommentDomain): Promise<ReportCommentDomain> {
        return this.comments.create(comment);
    }
}
