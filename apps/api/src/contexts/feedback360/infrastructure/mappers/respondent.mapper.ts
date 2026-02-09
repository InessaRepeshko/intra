import {
    Prisma,
    Respondent as PrismaRespondent,
    RespondentCategory as PrismaRespondentCategory,
    ResponseStatus as PrismaResponseStatus,
} from '@intra/database';
import { RespondentCategory, ResponseStatus } from '@intra/shared-kernel';
import { RespondentDomain } from '../../domain/respondent.domain';

export class RespondentMapper {
    static toDomain(relation: PrismaRespondent): RespondentDomain {
        return RespondentDomain.create({
            id: relation.id,
            reviewId: relation.reviewId,
            respondentId: relation.respondentId,
            fullName: relation.fullName,
            category: RespondentMapper.fromPrismaCategory(relation.category),
            responseStatus: RespondentMapper.fromPrismaResponseStatus(
                relation.responseStatus,
            ),
            respondentNote: relation.respondentNote,
            hrNote: relation.hrNote,
            positionId: relation.positionId,
            positionTitle: relation.positionTitle,
            teamId: relation.teamId,
            teamTitle: relation.teamTitle,
            invitedAt: relation.invitedAt,
            canceledAt: relation.canceledAt,
            respondedAt: relation.respondedAt,
            createdAt: relation.createdAt,
            updatedAt: relation.updatedAt,
        });
    }

    static toPrisma(
        respondent: RespondentDomain,
    ): Prisma.RespondentUncheckedCreateInput {
        return {
            reviewId: respondent.reviewId,
            respondentId: respondent.respondentId,
            fullName: respondent.fullName,
            category: RespondentMapper.toPrismaCategory(respondent.category),
            responseStatus: RespondentMapper.toPrismaResponseStatus(
                respondent.responseStatus,
            ),
            respondentNote: respondent.respondentNote,
            hrNote: respondent.hrNote,
            positionId: respondent.positionId,
            positionTitle: respondent.positionTitle,
            teamId: respondent.teamId,
            teamTitle: respondent.teamTitle,
            invitedAt: respondent.invitedAt,
            canceledAt: respondent.canceledAt,
            respondedAt: respondent.respondedAt,
        };
    }

    static toPrismaResponseStatus(
        domainStatus: ResponseStatus,
    ): PrismaResponseStatus {
        return domainStatus.toString().toUpperCase() as PrismaResponseStatus;
    }

    static toPrismaCategory(
        domainCategory: RespondentCategory,
    ): PrismaRespondentCategory {
        return domainCategory
            .toString()
            .toUpperCase() as PrismaRespondentCategory;
    }

    static fromPrismaResponseStatus(
        prismaStatus: PrismaResponseStatus,
    ): ResponseStatus {
        return prismaStatus.toString().toUpperCase() as ResponseStatus;
    }

    static fromPrismaCategory(
        prismaCategory: PrismaRespondentCategory,
    ): RespondentCategory {
        return prismaCategory.toString().toUpperCase() as RespondentCategory;
    }
}
