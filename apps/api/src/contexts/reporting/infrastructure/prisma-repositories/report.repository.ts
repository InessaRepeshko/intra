import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    REPORT_REPOSITORY,
    ReportRepositoryPort,
} from '../../application/ports/report.repository.port';
import { ReportDomain } from '../../domain/report.domain';
import { ReportMapper } from '../mappers/report.mapper';

@Injectable()
export class ReportRepository implements ReportRepositoryPort {
    readonly [REPORT_REPOSITORY] = REPORT_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async create(domain: ReportDomain): Promise<ReportDomain> {
        const created = await this.prisma.report.create({
            data: ReportMapper.toPrisma(domain),
            include: {
                analytics: { orderBy: { id: 'asc' } },
                comments: { orderBy: { id: 'asc' } },
            },
        });

        return ReportMapper.toDomainWithRelations(created);
    }

    async findById(id: number): Promise<ReportDomain | null> {
        const report = await this.prisma.report.findUnique({
            where: { id },
            include: {
                analytics: { orderBy: { id: 'asc' } },
                comments: { orderBy: { id: 'asc' } },
            },
        });

        return report ? ReportMapper.toDomainWithRelations(report) : null;
    }

    async findByReviewId(reviewId: number): Promise<ReportDomain | null> {
        const report = await this.prisma.report.findUnique({
            where: { reviewId },
            include: {
                analytics: { orderBy: { id: 'asc' } },
                comments: { orderBy: { id: 'asc' } },
            },
        });

        return report ? ReportMapper.toDomainWithRelations(report) : null;
    }
}
