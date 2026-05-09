import { Cluster, Prisma } from '@intra/database';
import { ClusterDomain } from '../../domain/cluster.domain';

export class ClusterMapper {
    static toDomain(cluster: Cluster): ClusterDomain {
        return ClusterDomain.create({
            id: cluster.id,
            competenceId: cluster.competenceId,
            lowerBound: cluster.lowerBound?.toNumber(),
            upperBound: cluster.upperBound?.toNumber(),
            title: cluster.title,
            description: cluster.description,
            createdAt: cluster.createdAt,
            updatedAt: cluster.updatedAt,
        });
    }

    static toPrisma(
        cluster: ClusterDomain,
    ): Prisma.ClusterUncheckedCreateInput {
        return {
            competenceId: cluster.competenceId,
            lowerBound: cluster.lowerBound,
            upperBound: cluster.upperBound,
            title: cluster.title,
            description: cluster.description,
        };
    }
}
