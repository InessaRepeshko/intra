import {
    Prisma,
    Answer as PrismaAnswer,
    RespondentCategory as PrismaRespondentCategory,
} from '@intra/database';
import { RespondentCategory } from '@intra/shared-kernel';
import { AnswerDomain } from '../../domain/answer.domain';
import { QuestionMapper } from './question.mapper';
import { RespondentMapper } from './respondent.mapper';

export class AnswerMapper {
    static toDomain(answer: PrismaAnswer): AnswerDomain {
        return AnswerDomain.create({
            id: answer.id,
            reviewId: answer.reviewId,
            questionId: answer.questionId,
            respondentCategory: RespondentMapper.fromPrismaCategory(
                answer.respondentCategory,
            ),
            answerType: QuestionMapper.fromPrismaAnswerType(answer.answerType),
            numericalValue: answer.numericalValue,
            textValue: answer.textValue,
        });
    }

    static toPrisma(answer: AnswerDomain): Prisma.AnswerUncheckedCreateInput {
        return {
            reviewId: answer.reviewId,
            questionId: answer.questionId,
            respondentCategory: RespondentMapper.toPrismaCategory(
                answer.respondentCategory,
            ),
            answerType: QuestionMapper.toPrismaAnswerType(answer.answerType),
            numericalValue: answer.numericalValue,
            textValue: answer.textValue,
            createdAt: answer.createdAt,
        };
    }

    static toPrismaCategory(
        domainCategory: RespondentCategory,
    ): PrismaRespondentCategory {
        return domainCategory
            .toString()
            .toUpperCase() as PrismaRespondentCategory;
    }

    static fromPrismaCategory(
        prismaCategory: PrismaRespondentCategory,
    ): RespondentCategory {
        return prismaCategory.toString().toUpperCase() as RespondentCategory;
    }
}
