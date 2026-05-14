import { Answer as PrismaAnswer } from '@intra/database';
import { AnswerType, RespondentCategory } from '@intra/shared-kernel';
import { AnswerDomain } from 'src/contexts/feedback360/domain/answer.domain';
import { AnswerMapper } from 'src/contexts/feedback360/infrastructure/mappers/answer.mapper';

describe('AnswerMapper', () => {
    const prismaAnswer = {
        id: 1,
        reviewId: 10,
        questionId: 20,
        respondentCategory: 'TEAM' as PrismaAnswer['respondentCategory'],
        answerType: 'NUMERICAL_SCALE' as PrismaAnswer['answerType'],
        numericalValue: 5,
        textValue: null,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    } as PrismaAnswer;

    describe('toDomain', () => {
        it('converts a prisma row into an AnswerDomain instance', () => {
            const domain = AnswerMapper.toDomain(prismaAnswer);

            expect(domain).toBeInstanceOf(AnswerDomain);
            expect(domain.id).toBe(1);
            expect(domain.reviewId).toBe(10);
            expect(domain.questionId).toBe(20);
            expect(domain.respondentCategory).toBe(RespondentCategory.TEAM);
            expect(domain.answerType).toBe(AnswerType.NUMERICAL_SCALE);
            expect(domain.numericalValue).toBe(5);
            expect(domain.textValue).toBeNull();
        });
    });

    describe('toPrisma', () => {
        it('serialises an AnswerDomain into a Prisma create input', () => {
            const domain = AnswerDomain.create({
                reviewId: 10,
                questionId: 20,
                respondentCategory: RespondentCategory.SELF_ASSESSMENT,
                answerType: AnswerType.TEXT_FIELD,
                textValue: 'Great work',
            });

            const prisma = AnswerMapper.toPrisma(domain);

            expect(prisma.reviewId).toBe(10);
            expect(prisma.questionId).toBe(20);
            expect(prisma.respondentCategory).toBe('SELF_ASSESSMENT');
            expect(prisma.answerType).toBe('TEXT_FIELD');
            expect(prisma.textValue).toBe('Great work');
            expect(prisma.numericalValue).toBeNull();
        });
    });

    describe('category conversions', () => {
        it('uppercases the category in both directions', () => {
            expect(AnswerMapper.toPrismaCategory(RespondentCategory.TEAM)).toBe(
                'TEAM',
            );
            expect(
                AnswerMapper.fromPrismaCategory(
                    'OTHER' as PrismaAnswer['respondentCategory'],
                ),
            ).toBe(RespondentCategory.OTHER);
        });
    });
});
