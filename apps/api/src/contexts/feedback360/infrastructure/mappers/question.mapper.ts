import {
    Prisma,
    AnswerType as PrismaAnswerType,
    Question as PrismaQuestion,
} from '@intra/database';
import { AnswerType } from '@intra/shared-kernel';
import { QuestionDomain } from '../../domain/question.domain';

export class QuestionMapper {
    static toDomain(question: PrismaQuestion): QuestionDomain {
        return QuestionDomain.create({
            id: question.id,
            cycleId: question.cycleId,
            questionTemplateId: question.questionTemplateId,
            title: question.title,
            answerType: QuestionMapper.fromPrismaAnswerType(
                question.answerType,
            ),
            competenceId: question.competenceId,
            isForSelfassessment: question.isForSelfassessment ?? false,
            createdAt: question.createdAt,
        });
    }

    static toPrisma(
        question: QuestionDomain,
    ): Prisma.QuestionUncheckedCreateInput {
        return {
            cycleId: question.cycleId,
            questionTemplateId: question.questionTemplateId,
            title: question.title,
            answerType: QuestionMapper.toPrismaAnswerType(question.answerType),
            competenceId: question.competenceId,
            isForSelfassessment: question.isForSelfassessment,
        };
    }

    static toPrismaAnswerType(domainType: AnswerType): PrismaAnswerType {
        return domainType.toString().toUpperCase() as PrismaAnswerType;
    }

    static fromPrismaAnswerType(prismaType: PrismaAnswerType): AnswerType {
        return prismaType.toString().toUpperCase() as AnswerType;
    }
}
