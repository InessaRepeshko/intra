import { Prisma, Reviewer as PrismaReviewer } from '@intra/database';
import { ReviewerDomain } from '../../domain/reviewer.domain';

export class ReviewerMapper {
    static toDomain(relation: PrismaReviewer): ReviewerDomain {
        return ReviewerDomain.create({
            id: relation.id,
            reviewId: relation.reviewId,
            reviewerId: relation.reviewerId,
            fullName: relation.fullName,
            positionId: relation.positionId,
            positionTitle: relation.positionTitle,
            teamId: relation.teamId,
            teamTitle: relation.teamTitle,
            createdAt: relation.createdAt,
        });
    }

    static toPrisma(
        reviewer: ReviewerDomain,
    ): Prisma.ReviewerUncheckedCreateInput {
        return {
            reviewId: reviewer.reviewId,
            reviewerId: reviewer.reviewerId,
            fullName: reviewer.fullName,
            positionId: reviewer.positionId,
            positionTitle: reviewer.positionTitle,
            teamId: reviewer.teamId,
            teamTitle: reviewer.teamTitle,
        };
    }
}
