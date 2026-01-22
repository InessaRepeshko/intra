import { PrismaClient } from '@intra/database';

export type TeamMap = Map<string, { id: number }>;

export type TeamSeed = {
    title: string;
    description?: string | null;
    headEmail?: string | null;
};

export const TEAM_SEED_DATA: TeamSeed[] = [
    {
        title: 'Head Office',
        description: 'Executive leadership and central operations',
        headEmail: 'oleksandr.bondarenko@intra.com',
    },
    {
        title: 'HR Team',
        description: 'Human resources and people operations',
        headEmail: 'natalya.tkachenko@intra.com',
    },
    {
        title: 'SE Team',
        description: 'Software engineering team',
        headEmail: 'serhii.oliinyk@intra.com',
    },
    {
        title: 'QA Team',
        description: 'Quality assurance and testing',
        headEmail: 'viktoria.moroz@intra.com',
    },
    {
        title: 'Design Team',
        description: 'Product and brand design',
        headEmail: 'olga.ivanchuk@intra.com',
    },
    {
        title: 'Sales Team',
        description: 'Sales and business development',
        headEmail: 'mykhailo.kozak@intra.com',
    },
    {
        title: 'Marketing Team',
        description: 'Marketing and communications',
        headEmail: 'anastasia.polishchuk@intra.com',
    },
    {
        title: 'Support Team',
        description: 'Customer support',
        headEmail: 'volodymyr.gavrylyuk@intra.com',
    },
    {
        title: 'Finance Team',
        description: 'Finance and accounting',
        headEmail: 'ludmyla.panasenko@intra.com',
    },
];

export default async function seedTeams(
    prisma: PrismaClient,
): Promise<TeamMap> {
    const teams: TeamMap = new Map();

    for (const team of TEAM_SEED_DATA) {
        const existing = await prisma.team.findFirst({ where: { title: team.title } });
        const record = existing
            ? await prisma.team.update({
                where: { id: existing.id },
                data: {
                    title: team.title,
                    description: team.description ?? null,
                },
            })
            : await prisma.team.create({
                data: {
                    title: team.title,
                    description: team.description ?? null,
                },
            });

        teams.set(team.title, { id: record.id });
    }

    return teams;
}
