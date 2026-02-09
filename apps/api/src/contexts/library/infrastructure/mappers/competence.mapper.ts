import { Competence, Prisma } from '@intra/database';
import { CompetenceDomain } from '../../domain/competence.domain';

export class CompetenceMapper {
    static toDomain(competence: Competence): CompetenceDomain {
        return CompetenceDomain.create({
            id: competence.id,
            code: competence.code,
            title: competence.title,
            description: competence.description,
            createdAt: competence.createdAt,
            updatedAt: competence.updatedAt,
        });
    }

    static toPrisma(
        competence: CompetenceDomain,
    ): Prisma.CompetenceUncheckedCreateInput {
        return {
            code: competence.code,
            title: competence.title,
            description: competence.description,
        };
    }
}
