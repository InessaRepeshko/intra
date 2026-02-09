import {
    Prisma,
    AnswerType as PrismaAnswerType,
    QuestionTemplate as PrismaQuestionTemplate,
    QuestionTemplateStatus as PrismaQuestionTemplateStatus,
} from '@intra/database';
import { AnswerType, QuestionTemplateStatus } from '@intra/shared-kernel';
import { QuestionTemplateDomain } from '../../domain/question-template.domain';

type QuestionWithPositions = PrismaQuestionTemplate & {
    positionRelations?: { positionId: number }[];
};

export class QuestionTemplateMapper {
    static toDomain(question: QuestionWithPositions): QuestionTemplateDomain {
        return QuestionTemplateDomain.create({
            id: question.id,
            title: question.title,
            answerType: QuestionTemplateMapper.fromPrismaAnswerType(
                question.answerType,
            ),
            competenceId: question.competenceId,
            isForSelfassessment: question.isForSelfassessment ?? false,
            status: QuestionTemplateMapper.fromPrismaStatus(question.status),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
            positionIds:
                question.positionRelations?.map((q) => q.positionId) ?? [],
        });
    }

    static toPrisma(
        question: QuestionTemplateDomain,
    ): Prisma.QuestionTemplateUncheckedCreateInput {
        return {
            title: question.title,
            answerType: question.answerType,
            competenceId: question.competenceId,
            isForSelfassessment: question.isForSelfassessment,
            status: question.status,
        };
    }

    static toPrismaAnswerType(domainType: AnswerType): PrismaAnswerType {
        return domainType.toString().toUpperCase() as PrismaAnswerType;
    }

    static toPrismaStatus(
        domainStatus: QuestionTemplateStatus,
    ): PrismaQuestionTemplateStatus {
        return domainStatus
            .toString()
            .toUpperCase() as PrismaQuestionTemplateStatus;
    }

    static fromPrismaAnswerType(prismaType: PrismaAnswerType): AnswerType {
        return prismaType.toString().toUpperCase() as AnswerType;
    }

    static fromPrismaStatus(
        prismaStatus: PrismaQuestionTemplateStatus,
    ): QuestionTemplateStatus {
        return prismaStatus.toString().toUpperCase() as QuestionTemplateStatus;
    }
}
