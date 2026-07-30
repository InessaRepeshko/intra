import { QuestionTemplate as PrismaQuestionTemplate } from '@intra/database';
import { AnswerType, QuestionTemplateStatus } from '@intra/shared-kernel';
import { QuestionTemplateDomain } from 'src/contexts/library/domain/question-template.domain';
import { QuestionTemplateMapper } from 'src/contexts/library/infrastructure/mappers/question-template.mapper';

describe('QuestionTemplateMapper', () => {
    const prismaTemplate = {
        id: 1,
        title: 'How is teamwork?',
        answerType: 'NUMERICAL_SCALE' as PrismaQuestionTemplate['answerType'],
        competenceId: 7,
        isForSelfassessment: true,
        status: 'ACTIVE' as PrismaQuestionTemplate['status'],
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    } as PrismaQuestionTemplate;

    describe('toDomain', () => {
        it('converts a prisma row into a QuestionTemplateDomain', () => {
            const domain = QuestionTemplateMapper.toDomain(prismaTemplate);

            expect(domain).toBeInstanceOf(QuestionTemplateDomain);
            expect(domain.id).toBe(1);
            expect(domain.title).toBe('How is teamwork?');
            expect(domain.answerType).toBe(AnswerType.NUMERICAL_SCALE);
            expect(domain.competenceId).toBe(7);
            expect(domain.isForSelfassessment).toBe(true);
            expect(domain.status).toBe(QuestionTemplateStatus.ACTIVE);
            expect(domain.positionIds).toEqual([]);
        });

        it('coerces null isForSelfassessment to false', () => {
            const domain = QuestionTemplateMapper.toDomain({
                ...prismaTemplate,
                isForSelfassessment: null,
            } as unknown as PrismaQuestionTemplate);

            expect(domain.isForSelfassessment).toBe(false);
        });

        it('reads positionIds from positionRelations when supplied', () => {
            const domain = QuestionTemplateMapper.toDomain({
                ...prismaTemplate,
                positionRelations: [{ positionId: 3 }, { positionId: 4 }],
            } as any);

            expect(domain.positionIds).toEqual([3, 4]);
        });
    });

    describe('toPrisma', () => {
        it('serialises a domain into a Prisma create input', () => {
            const domain = QuestionTemplateDomain.create({
                title: 'Q?',
                answerType: AnswerType.TEXT_FIELD,
                competenceId: 7,
                isForSelfassessment: false,
                status: QuestionTemplateStatus.ARCHIVE,
            });

            const prisma = QuestionTemplateMapper.toPrisma(domain);

            expect(prisma).toEqual({
                title: 'Q?',
                answerType: AnswerType.TEXT_FIELD,
                competenceId: 7,
                isForSelfassessment: false,
                status: QuestionTemplateStatus.ARCHIVE,
            });
        });
    });

    describe('enum conversions', () => {
        it('uppercases the answer type in both directions', () => {
            expect(
                QuestionTemplateMapper.toPrismaAnswerType(
                    AnswerType.NUMERICAL_SCALE,
                ),
            ).toBe('NUMERICAL_SCALE');
            expect(
                QuestionTemplateMapper.fromPrismaAnswerType(
                    'TEXT_FIELD' as PrismaQuestionTemplate['answerType'],
                ),
            ).toBe(AnswerType.TEXT_FIELD);
        });

        it('uppercases the status in both directions', () => {
            expect(
                QuestionTemplateMapper.toPrismaStatus(
                    QuestionTemplateStatus.ARCHIVE,
                ),
            ).toBe('ARCHIVE');
            expect(
                QuestionTemplateMapper.fromPrismaStatus(
                    'ACTIVE' as PrismaQuestionTemplate['status'],
                ),
            ).toBe(QuestionTemplateStatus.ACTIVE);
        });
    });
});
