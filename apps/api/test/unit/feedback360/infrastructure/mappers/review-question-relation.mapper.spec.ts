import { ReviewQuestionRelation as PrismaReviewQuestionRelation } from '@intra/database';
import { AnswerType } from '@intra/shared-kernel';
import { ReviewQuestionRelationDomain } from 'src/contexts/feedback360/domain/review-question-relation.domain';
import { ReviewQuestionRelationMapper } from 'src/contexts/feedback360/infrastructure/mappers/review-question-relation.mapper';

describe('ReviewQuestionRelationMapper', () => {
    const prismaRelation = {
        id: 1,
        reviewId: 10,
        questionId: 20,
        questionTitle: 'How effective is teamwork?',
        answerType:
            'NUMERICAL_SCALE' as PrismaReviewQuestionRelation['answerType'],
        competenceId: 3,
        competenceTitle: 'Teamwork',
        competenceCode: 'TWK',
        competenceDescription: 'Working with peers',
        isForSelfassessment: true,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    } as PrismaReviewQuestionRelation;

    describe('toDomain', () => {
        it('converts a prisma row into a ReviewQuestionRelationDomain', () => {
            const domain =
                ReviewQuestionRelationMapper.toDomain(prismaRelation);

            expect(domain).toBeInstanceOf(ReviewQuestionRelationDomain);
            expect(domain.id).toBe(1);
            expect(domain.reviewId).toBe(10);
            expect(domain.questionId).toBe(20);
            expect(domain.questionTitle).toBe('How effective is teamwork?');
            expect(domain.answerType).toBe(AnswerType.NUMERICAL_SCALE);
            expect(domain.competenceId).toBe(3);
            expect(domain.competenceTitle).toBe('Teamwork');
            expect(domain.competenceCode).toBe('TWK');
            expect(domain.competenceDescription).toBe('Working with peers');
            expect(domain.isForSelfassessment).toBe(true);
        });

        it('normalises null competence code/description and isForSelfassessment', () => {
            const domain = ReviewQuestionRelationMapper.toDomain({
                ...prismaRelation,
                competenceCode: null,
                competenceDescription: null,
                isForSelfassessment: null,
            } as unknown as PrismaReviewQuestionRelation);
            expect(domain.competenceCode).toBeNull();
            expect(domain.competenceDescription).toBeNull();
            expect(domain.isForSelfassessment).toBe(false);
        });
    });

    describe('toPrisma', () => {
        it('serialises a domain into a Prisma create input', () => {
            const domain = ReviewQuestionRelationDomain.create({
                reviewId: 10,
                questionId: 20,
                questionTitle: 'How effective is teamwork?',
                answerType: AnswerType.TEXT_FIELD,
                competenceId: 3,
                competenceTitle: 'Teamwork',
                competenceCode: null,
                competenceDescription: null,
                isForSelfassessment: false,
            });

            const prisma = ReviewQuestionRelationMapper.toPrisma(domain);

            expect(prisma.reviewId).toBe(10);
            expect(prisma.questionId).toBe(20);
            expect(prisma.questionTitle).toBe('How effective is teamwork?');
            expect(prisma.answerType).toBe('TEXT_FIELD');
            expect(prisma.competenceId).toBe(3);
            expect(prisma.competenceTitle).toBe('Teamwork');
            expect(prisma.competenceCode).toBeNull();
            expect(prisma.competenceDescription).toBeNull();
            expect(prisma.isForSelfassessment).toBe(false);
        });
    });
});
