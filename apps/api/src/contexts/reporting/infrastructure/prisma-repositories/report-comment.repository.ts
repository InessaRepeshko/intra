import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    REPORT_COMMENT_REPOSITORY,
    ReportCommentRepositoryPort,
} from '../../application/ports/report-comment.repository.port';
import { ReportCommentDomain } from '../../domain/report-comment.domain';
import { ReportCommentMapper } from '../mappers/report-comment.mapper';

@Injectable()
export class ReportCommentRepository implements ReportCommentRepositoryPort {
    readonly [REPORT_COMMENT_REPOSITORY] = REPORT_COMMENT_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async create(comment: ReportCommentDomain): Promise<ReportCommentDomain> {
        const created = await this.prisma.reportComment.create({
            data: ReportCommentMapper.toPrisma(comment),
        });
        return ReportCommentMapper.toDomain(created);
    }

    async findByReportId(reportId: number): Promise<ReportCommentDomain[]> {
        const comments = await this.prisma.reportComment.findMany({
            where: { reportId },
            orderBy: { id: 'asc' },
        });

        return comments.map(ReportCommentMapper.toDomain);
    }

    async findById(id: number): Promise<ReportCommentDomain | null> {
        const comment = await this.prisma.reportComment.findUnique({
            where: { id },
        });

        return comment ? ReportCommentMapper.toDomain(comment) : null;
    }
}
