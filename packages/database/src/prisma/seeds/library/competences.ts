import type { PrismaClient } from '@intra/database';

export const COMPETENCES_SEED_DATA = [
    { code: 'LEAD', title: 'Leadership', description: 'Guides teams with clarity, accountability, and values.' },
    { code: 'COMM', title: 'Communication', description: 'Shares context clearly and adapts message to the audience.' },
    { code: 'TECH', title: 'Technical Excellence', description: 'Builds reliable, scalable solutions and elevates engineering craft.' },
    { code: 'PMGT', title: 'People Management', description: 'Develops people, provides feedback, and supports growth.' },
    { code: 'DELIV', title: 'Delivery & Process', description: 'Plans, executes, and continuously improves delivery practices.' },
    { code: 'QUAL', title: 'Quality & Risk', description: 'Prevents defects early and manages delivery risks transparently.' },
    { code: 'PROD', title: 'Product & UX Thinking', description: 'Solves user problems with usable, feasible solutions.' },
    { code: 'CUST', title: 'Customer Focus', description: 'Understands client needs and turns feedback into action.' },
    { code: 'COLLAB', title: 'Collaboration & Culture', description: 'Builds healthy collaboration and cross-team alignment.' },
    { code: 'STRAT', title: 'Strategic Thinking', description: 'Connects daily work to long-term, market-aware strategy.' },
];

export default async function seedCompetences(prisma: PrismaClient) {
    for (const c of COMPETENCES_SEED_DATA) {
        await prisma.competence.upsert({
            where: { title: c.title },
            update: {},
            create: {
                code: c.code,
                title: c.title,
                description: c.description,
            },
        });
    }
}
