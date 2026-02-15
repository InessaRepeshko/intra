import {
    Prisma,
    Cycle as PrismaCycle,
    CycleStage as PrismaCycleStage,
} from '@intra/database';
import { CycleStage } from '@intra/shared-kernel';
import { CycleDomain } from '../../domain/cycle.domain';

export class CycleMapper {
    static toDomain(cycle: PrismaCycle): CycleDomain {
        return CycleDomain.create({
            id: cycle.id,
            title: cycle.title,
            description: cycle.description,
            hrId: cycle.hrId,
            minRespondentsThreshold: cycle.minRespondentsThreshold,
            stage: CycleMapper.fromPrismaStage(cycle.stage),
            isActive: cycle.isActive ?? true,
            startDate: cycle.startDate,
            reviewDeadline: cycle.reviewDeadline,
            approvalDeadline: cycle.approvalDeadline,
            responseDeadline: cycle.responseDeadline,
            endDate: cycle.endDate,
            createdAt: cycle.createdAt,
            updatedAt: cycle.updatedAt,
        });
    }

    static toPrisma(cycle: CycleDomain): Prisma.CycleUncheckedCreateInput {
        return {
            title: cycle.title,
            description: cycle.description,
            hrId: cycle.hrId,
            minRespondentsThreshold: cycle.minRespondentsThreshold,
            stage: CycleMapper.toPrismaStage(cycle.stage),
            isActive: cycle.isActive,
            startDate: cycle.startDate,
            reviewDeadline: cycle.reviewDeadline,
            approvalDeadline: cycle.approvalDeadline,
            responseDeadline: cycle.responseDeadline,
            endDate: cycle.endDate,
        };
    }

    static toPrismaStage(domainStage: CycleStage): PrismaCycleStage {
        return domainStage.toString().toUpperCase() as PrismaCycleStage;
    }

    static fromPrismaStage(prismaStage: PrismaCycleStage): CycleStage {
        return prismaStage.toString().toUpperCase() as CycleStage;
    }
}
