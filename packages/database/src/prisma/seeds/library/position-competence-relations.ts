import type { PrismaClient } from '@intra/database';
import type { PositionMap } from '../organisation/positions';

type PositionCompetenceSeed = {
    positionTitle: string;
    competenceCodes: string[];
};

const POSITION_COMPETENCES_SEED_DATA: PositionCompetenceSeed[] = [
    {
        positionTitle: 'CEO',
        competenceCodes: [
            'LEAD',
            'COMM',
            'PMGT',
            'DELIV',
            'QUAL',
            'PROD',
            'CUST',
            'COLLAB',
            'STRAT',
        ],
    },
    {
        positionTitle: 'CTO',
        competenceCodes: [
            'LEAD',
            'COMM',
            'TECH',
            'PMGT',
            'DELIV',
            'QUAL',
            'PROD',
            'COLLAB',
            'STRAT',
        ],
    },
    {
        positionTitle: 'Team Lead',
        competenceCodes: [
            'LEAD',
            'COMM',
            'TECH',
            'PMGT',
            'DELIV',
            'QUAL',
            'COLLAB',
        ],
    },
    {
        positionTitle: 'Tech Lead',
        competenceCodes: [
            'LEAD',
            'COMM',
            'TECH',
            'PMGT',
            'DELIV',
            'QUAL',
            'COLLAB',
            'STRAT',
        ],
    },
    {
        positionTitle: 'Senior Software Engineer',
        competenceCodes: [
            'COMM',
            'TECH',
            'DELIV',
            'QUAL',
            'PROD',
            'CUST',
            'COLLAB',
            'STRAT',
            'LEAD',
            'PMGT',
        ], // All 10
    },
    {
        positionTitle: 'Middle Software Engineer',
        competenceCodes: ['COMM', 'TECH', 'DELIV', 'QUAL', 'COLLAB'],
    },
    {
        positionTitle: 'Junior Software Engineer',
        competenceCodes: ['COMM', 'TECH', 'DELIV', 'COLLAB'],
    },
    {
        positionTitle: 'Senior QA Engineer',
        competenceCodes: ['COMM', 'TECH', 'DELIV', 'QUAL', 'COLLAB', 'CUST'],
    },
    {
        positionTitle: 'HR Director',
        competenceCodes: ['LEAD', 'COMM', 'PMGT', 'DELIV', 'COLLAB', 'STRAT'],
    },
    {
        positionTitle: 'HR Manager',
        competenceCodes: ['COMM', 'PMGT', 'DELIV', 'COLLAB'],
    },
    {
        positionTitle: 'Senior Designer',
        competenceCodes: ['COMM', 'PROD', 'CUST', 'COLLAB', 'STRAT', 'TECH'],
    },
    {
        positionTitle: 'Sales Specialist',
        competenceCodes: ['COMM', 'CUST', 'COLLAB', 'STRAT'],
    },
];

export default async function seedPositionCompetenceRelations(
    prisma: PrismaClient,
    positionMap: PositionMap,
) {
    for (const item of POSITION_COMPETENCES_SEED_DATA) {
        const position = positionMap.get(item.positionTitle);
        if (!position) {
            console.warn(
                `⚠️ Position ${item.positionTitle} not found, skip competence links`,
            );
            continue;
        }

        for (const code of item.competenceCodes) {
            const competence = await prisma.competence.findUnique({
                where: { code },
            });
            if (!competence) {
                console.warn(
                    `⚠️ Competence ${code} not found, skip link for ${item.positionTitle}`,
                );
                continue;
            }

            const existing = await prisma.positionCompetenceRelation.findUnique(
                {
                    where: {
                        positionId_competenceId: {
                            positionId: position.id,
                            competenceId: competence.id,
                        },
                    },
                },
            );

            if (existing) continue;

            await prisma.positionCompetenceRelation.create({
                data: {
                    positionId: position.id,
                    competenceId: competence.id,
                },
            });
        }
    }
}
