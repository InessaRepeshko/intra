import {
    Prisma,
    Review as PrismaReview,
    ReviewStage as PrismaReviewStage,
} from '@intra/database';
import { ReviewStage } from '@intra/shared-kernel';
import { ReviewDomain } from '../../domain/review.domain';

export class ReviewMapper {
    static toDomain(review: PrismaReview): ReviewDomain {
        return ReviewDomain.create({
            id: review.id,
            rateeId: review.rateeId,
            rateeFullName: review.rateeFullName,
            rateePositionId: review.rateePositionId,
            rateePositionTitle: review.rateePositionTitle,
            hrId: review.hrId,
            hrFullName: review.hrFullName,
            hrNote: review.hrNote,
            teamId: review.teamId,
            teamTitle: review.teamTitle,
            managerId: review.managerId,
            managerFullName: review.managerFullName,
            managerPositionId: review.managerPositionId,
            managerPositionTitle: review.managerPositionTitle,
            cycleId: review.cycleId,
            stage: ReviewMapper.fromPrismaStage(review.stage),
            reportId: review.reportId,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
        });
    }

    static toPrisma(review: ReviewDomain): Prisma.ReviewUncheckedCreateInput {
        return {
            rateeId: review.rateeId,
            rateeFullName: review.rateeFullName,
            rateePositionId: review.rateePositionId,
            rateePositionTitle: review.rateePositionTitle,
            hrId: review.hrId,
            hrFullName: review.hrFullName,
            hrNote: review.hrNote,
            teamId: review.teamId,
            teamTitle: review.teamTitle,
            managerId: review.managerId,
            managerFullName: review.managerFullName,
            managerPositionId: review.managerPositionId,
            managerPositionTitle: review.managerPositionTitle,
            cycleId: review.cycleId,
            stage: ReviewMapper.toPrismaStage(review.stage),
            reportId: review.reportId,
        };
    }

    static toPrismaStage(domainStage: ReviewStage): PrismaReviewStage {
        return domainStage.toString().toUpperCase() as PrismaReviewStage;
    }

    static fromPrismaStage(prismaStage: PrismaReviewStage): ReviewStage {
        return prismaStage.toString().toUpperCase() as ReviewStage;
    }
}
