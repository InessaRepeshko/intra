import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    REPORT_COMMENT_REPOSITORY,
    ReportCommentRepositoryPort,
} from '../../application/ports/report-comment.repository.port';
import { ReportCommentDomain } from '../../domain/report-comment.domain';
import { ReportingMapper } from './reporting.mapper';

@Injectable()
export class ReportCommentRepository implements ReportCommentRepositoryPort {
    readonly [REPORT_COMMENT_REPOSITORY] = REPORT_COMMENT_REPOSITORY;

    constructor(private readonly prisma: PrismaService) { }

    async findByReportId(reportId: number): Promise<ReportCommentDomain[]> {
        const comments = await this.prisma.reportComment.findMany({
            where: { reportId },
            orderBy: { id: 'asc' },
        });

        return comments.map(ReportingMapper.toReportCommentDomain);
    }

    async findById(id: number): Promise<ReportCommentDomain | null> {
        const comment = await this.prisma.reportComment.findUnique({
            where: { id },
        });

        return comment ? ReportingMapper.toReportCommentDomain(comment) : null;
    }
}
