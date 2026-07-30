import '../../../setup-env';

import { TestingModule } from '@nestjs/testing';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { PositionCompetenceRelationDomain } from 'src/contexts/library/domain/position-competence-relation.domain';
import { CompetenceRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence.repository';
import { PositionCompetenceRelationRepository } from 'src/contexts/library/infrastructure/prisma-repositories/position-competence-relation.repository';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createLibraryTestModule,
    resetLibraryTables,
} from '../test-app-library';

describe('PositionCompetenceRelationRepository (integration)', () => {
    let module: TestingModule;
    let repo: PositionCompetenceRelationRepository;
    let competences: CompetenceRepository;
    let positions: PositionRepository;
    let prisma: PrismaService;

    beforeAll(async () => {
        module = await createLibraryTestModule();
        repo = module.get(PositionCompetenceRelationRepository);
        competences = module.get(CompetenceRepository);
        positions = module.get(PositionRepository);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetLibraryTables(prisma);
    });

    afterAll(async () => {
        await module.close();
    });

    async function setup() {
        const competence = await competences.create(
            CompetenceDomain.create({ title: 'Teamwork' }),
        );
        const position = await positions.create(
            PositionDomain.create({ title: 'Engineer' }),
        );
        return { competenceId: competence.id!, positionId: position.id! };
    }

    describe('link', () => {
        it('creates a relation row', async () => {
            const { competenceId, positionId } = await setup();

            const created = await repo.link(competenceId, positionId);

            expect(created).toBeInstanceOf(PositionCompetenceRelationDomain);
            expect(created.competenceId).toBe(competenceId);
            expect(created.positionId).toBe(positionId);
        });

        it('is idempotent: returns the existing row on duplicate link', async () => {
            const { competenceId, positionId } = await setup();

            const first = await repo.link(competenceId, positionId);
            const second = await repo.link(competenceId, positionId);

            expect(second.id).toBe(first.id);

            const rows = await prisma.positionCompetenceRelation.findMany({
                where: { competenceId, positionId },
            });
            expect(rows).toHaveLength(1);
        });
    });

    describe('unlink', () => {
        it('removes the relation when it exists', async () => {
            const { competenceId, positionId } = await setup();
            await repo.link(competenceId, positionId);

            await repo.unlink(competenceId, positionId);

            const rows = await prisma.positionCompetenceRelation.findMany({
                where: { competenceId, positionId },
            });
            expect(rows).toEqual([]);
        });

        it('does not throw when the relation is absent', async () => {
            const { competenceId, positionId } = await setup();
            await expect(
                repo.unlink(competenceId, positionId),
            ).resolves.toBeUndefined();
        });
    });

    describe('listByCompetence / listByPosition', () => {
        it('lists all relations for a competence', async () => {
            const { competenceId, positionId: p1 } = await setup();
            const p2 = (
                await positions.create(
                    PositionDomain.create({ title: 'Manager' }),
                )
            ).id!;
            await repo.link(competenceId, p1);
            await repo.link(competenceId, p2);

            const result = await repo.listByCompetence(competenceId);

            expect(result.map((r) => r.positionId).sort()).toEqual(
                [p1, p2].sort(),
            );
        });

        it('lists all relations for a position', async () => {
            const { competenceId: c1, positionId } = await setup();
            const c2 = (
                await competences.create(
                    CompetenceDomain.create({ title: 'Leadership' }),
                )
            ).id!;
            await repo.link(c1, positionId);
            await repo.link(c2, positionId);

            const result = await repo.listByPosition(positionId);

            expect(result.map((r) => r.competenceId).sort()).toEqual(
                [c1, c2].sort(),
            );
        });
    });

    describe('replaceForCompetence', () => {
        it('keeps the supplied positions and drops the others', async () => {
            const { competenceId, positionId: p1 } = await setup();
            const p2 = (
                await positions.create(
                    PositionDomain.create({ title: 'Manager' }),
                )
            ).id!;
            const p3 = (
                await positions.create(
                    PositionDomain.create({ title: 'Director' }),
                )
            ).id!;
            await repo.link(competenceId, p1);
            await repo.link(competenceId, p2);

            const result = await repo.replaceForCompetence(competenceId, [
                p2,
                p3,
            ]);

            expect(result.map((r) => r.positionId).sort()).toEqual(
                [p2, p3].sort(),
            );
        });

        it('removes all relations when the new list is empty', async () => {
            const { competenceId, positionId } = await setup();
            await repo.link(competenceId, positionId);

            const result = await repo.replaceForCompetence(competenceId, []);

            expect(result).toEqual([]);
        });
    });

    describe('deleteAllForCompetence', () => {
        it('removes every relation tied to the competence', async () => {
            const { competenceId, positionId: p1 } = await setup();
            const p2 = (
                await positions.create(
                    PositionDomain.create({ title: 'Manager' }),
                )
            ).id!;
            await repo.link(competenceId, p1);
            await repo.link(competenceId, p2);

            await repo.deleteAllForCompetence(competenceId);

            await expect(repo.listByCompetence(competenceId)).resolves.toEqual(
                [],
            );
        });
    });
});
