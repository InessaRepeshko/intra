import { Question as PrismaQuestion } from '@intra/database';
import { AnswerType } from '@intra/shared-kernel';
import { QuestionDomain } from 'src/contexts/feedback360/domain/question.domain';
import { QuestionMapper } from 'src/contexts/feedback360/infrastructure/mappers/question.mapper';

describe('QuestionMapper', () => {
    const prismaQuestion = {
        id: 1,
        cycleId: 100,
        questionTemplateId: 50,
        title: 'Question?',
        answerType: 'NUMERICAL_SCALE' as PrismaQuestion['answerType'],
        competenceId: 7,
        isForSelfassessment: true,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    } as PrismaQuestion;

    describe('toDomain', () => {
        it('converts a prisma row into a QuestionDomain instance', () => {
            const domain = QuestionMapper.toDomain(prismaQuestion);

            expect(domain).toBeInstanceOf(QuestionDomain);
            expect(domain.id).toBe(1);
            expect(domain.title).toBe('Question?');
            expect(domain.answerType).toBe(AnswerType.NUMERICAL_SCALE);
            expect(domain.competenceId).toBe(7);
            expect(domain.cycleId).toBe(100);
            expect(domain.questionTemplateId).toBe(50);
            expect(domain.isForSelfassessment).toBe(true);
        });

        it('falls back isForSelfassessment to false when null', () => {
            const domain = QuestionMapper.toDomain({
                ...prismaQuestion,
                isForSelfassessment: null,
            } as unknown as PrismaQuestion);
            expect(domain.isForSelfassessment).toBe(false);
        });
    });

    describe('toPrisma', () => {
        it('serialises a QuestionDomain into a Prisma create input', () => {
            const domain = QuestionDomain.create({
                cycleId: 100,
                title: 'New question?',
                answerType: AnswerType.TEXT_FIELD,
                competenceId: 7,
                isForSelfassessment: false,
            });

            const prisma = QuestionMapper.toPrisma(domain);

            expect(prisma.cycleId).toBe(100);
            expect(prisma.title).toBe('New question?');
            expect(prisma.answerType).toBe('TEXT_FIELD');
            expect(prisma.competenceId).toBe(7);
            expect(prisma.isForSelfassessment).toBe(false);
        });
    });

    describe('answer type conversions', () => {
        it('uppercases the answer type in both directions', () => {
            expect(
                QuestionMapper.toPrismaAnswerType(AnswerType.NUMERICAL_SCALE),
            ).toBe('NUMERICAL_SCALE');
            expect(
                QuestionMapper.fromPrismaAnswerType(
                    'TEXT_FIELD' as PrismaQuestion['answerType'],
                ),
            ).toBe(AnswerType.TEXT_FIELD);
        });
    });
});
