import { PrismaClient } from '@intra/database';

export type PositionMap = Map<string, { id: number }>;

export type PositionSeed = {
    title: string;
    description?: string | null;
};

export const POSITION_SEED_DATA: PositionSeed[] = [
    {
        title: 'CEO',
        description: 'Chief Executive Officer',
    },
    {
        title: 'CTO',
        description: 'Chief Technology Officer',
    },
    {
        title: 'COO',
        description: 'Chief Operating Officer',
    },
    {
        title: 'CFO',
        description: 'Chief Financial Officer',
    },
    {
        title: 'CMO',
        description: 'Chief Marketing Officer',
    },
    {
        title: 'HR Director',
        description: 'Human Resources Director',
    },
    {
        title: 'HR Manager',
        description: 'Human Resources Manager',
    },
    {
        title: 'HR Specialist',
        description: 'Human Resources Specialist',
    },
    {
        title: 'Team Lead',
        description: 'Team Lead',
    },
    {
        title: 'Tech Lead',
        description: 'Tech Lead',
    },
    {
        title: 'Senior Software Engineer',
        description: 'Senior Software Engineer',
    },
    {
        title: 'Middle Software Engineer',
        description: 'Middle Software Engineer',
    },
    {
        title: 'Junior Software Engineer',
        description: 'Junior Software Engineer',
    },
    {
        title: 'Senior QA Engineer',
        description: 'Senior QA Engineer',
    },
    {
        title: 'Middle QA Engineer',
        description: 'Middle QA Engineer',
    },
    {
        title: 'Junior QA Engineer',
        description: 'Junior QA Engineer',
    },
    {
        title: 'Senior Designer',
        description: 'Senior Designer',
    },
    {
        title: 'Middle Designer',
        description: 'Middle Designer',
    },
    {
        title: 'Junior Designer',
        description: 'Junior Designer',
    },
    {
        title: 'Sales Specialist',
        description: 'Sales Specialist',
    },
    {
        title: 'Marketing Specialist',
        description: 'Marketing Specialist',
    },
    {
        title: 'Support Specialist',
        description: 'Support Specialist',
    },
    {
        title: 'Finance Specialist',
        description: 'Finance Specialist',
    },
];

export default async function seedPositions(
    prisma: PrismaClient,
): Promise<PositionMap> {
    const positions: PositionMap = new Map();

    for (const position of POSITION_SEED_DATA) {
        const existing = await prisma.position.findFirst({
            where: { title: position.title },
        });
        const record = existing
            ? await prisma.position.update({
                  where: { id: existing.id },
                  data: {
                      title: position.title,
                      description: position.description ?? null,
                  },
              })
            : await prisma.position.create({
                  data: {
                      title: position.title,
                      description: position.description ?? null,
                  },
              });

        positions.set(position.title, { id: record.id });
    }

    return positions;
}
