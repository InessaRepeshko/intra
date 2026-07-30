import { RespondentCategory } from '@intra/shared-kernel';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { REPORT_COMMENT_REPOSITORY } from 'src/contexts/reporting/application/ports/report-comment.repository.port';
import { ReportCommentService } from 'src/contexts/reporting/application/services/report-comment.service';
import { ReportingService } from 'src/contexts/reporting/application/services/reports.service';
import { ReportCommentDomain } from 'src/contexts/reporting/domain/report-comment.domain';

function buildComment(): ReportCommentDomain {
    return ReportCommentDomain.create({
        id: 1,
        reportId: 10,
        questionId: 20,
        questionTitle: 'Q?',
        comment: 'Nice',
        respondentCategories: [RespondentCategory.TEAM],
        numberOfMentions: 1,
    });
}

describe('ReportCommentService', () => {
    let service: ReportCommentService;
    let comments: any;
    let reporting: any;

    beforeEach(async () => {
        comments = {
            findByReportId: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
        };
        reporting = { getById: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                ReportCommentService,
                { provide: REPORT_COMMENT_REPOSITORY, useValue: comments },
                { provide: ReportingService, useValue: reporting },
            ],
        }).compile();

        service = module.get(ReportCommentService);
    });

    describe('getByReportId', () => {
        it('returns comments after asserting access via ReportingService', async () => {
            reporting.getById.mockResolvedValue({ id: 10 });
            comments.findByReportId.mockResolvedValue([buildComment()]);

            const result = await service.getByReportId(10);

            expect(reporting.getById).toHaveBeenCalledWith(10, undefined);
            expect(comments.findByReportId).toHaveBeenCalledWith(10);
            expect(result).toHaveLength(1);
        });

        it('throws NotFoundException when no comments are found', async () => {
            reporting.getById.mockResolvedValue({ id: 10 });
            comments.findByReportId.mockResolvedValue([]);

            await expect(service.getByReportId(10)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('propagates errors from the reporting access check', async () => {
            reporting.getById.mockRejectedValue(new NotFoundException('x'));

            await expect(service.getByReportId(10)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('getById', () => {
        it('returns the comment when found', async () => {
            const comment = buildComment();
            comments.findById.mockResolvedValue(comment);

            await expect(service.getById(1)).resolves.toBe(comment);
        });

        it('throws NotFoundException when missing', async () => {
            comments.findById.mockResolvedValue(null);
            await expect(service.getById(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('create', () => {
        it('delegates to the repository', async () => {
            const comment = buildComment();
            comments.create.mockResolvedValue(comment);

            await expect(service.create(comment)).resolves.toBe(comment);
            expect(comments.create).toHaveBeenCalledWith(comment);
        });
    });
});
