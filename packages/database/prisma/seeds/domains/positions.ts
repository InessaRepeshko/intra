import { PrismaClient } from '@prisma/client';

export default async function seedPositions(prisma: PrismaClient) {
    const positions = [
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
            title: 'Software Engineer',
            description: 'Software Engineer',
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
            title: 'Team Lead',   
            description: 'Team Lead',
        },
        {
            title: 'Tech Lead',   
            description: 'Tech Lead',
        },
        {
            title: 'QA Engineer',
            description: 'QA Engineer',
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
            title: 'Designer',
            description: 'Designer',
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
        {
            title: 'HR Specialist',
            description: 'HR Specialist',
        },
    ];

    return Promise.all(positions.map(async (p) => {
        return prisma.position.upsert({
            where: { title: p.title } as any,
            update: p,
            create: p,
        });
    }));
}

