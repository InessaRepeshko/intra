import { PrismaClient } from '@intra/database';
import type { PositionMap } from './positions';

export type PositionHierarchySeed = {
    superiorPosition: string;
    subordinatePosition: string;
};

/**
 * Defines organizational hierarchy between positions
 * CEO
 *  ├── CTO
 *  │    ├── Team Lead
 *  │    │    ├── Tech Lead
 *  │    │    │    ├── Senior Software Engineer
 *  │    │    │    │    ├── Middle Software Engineer
 *  │    │    │    │    │    └── Junior Software Engineer
 *  │    │    │    ├── Senior QA Engineer
 *  │    │    │    │    ├── Middle QA Engineer
 *  │    │    │    │    │    └── Junior QA Engineer
 *  ├── COO
 *  │    ├── HR Director
 *  │    │    ├── HR Manager
 *  │    │    │    └── HR Specialist
 *  │    ├── Support Specialist
 *  ├── CFO
 *  │    └── Finance Specialist
 *  ├── CMO
 *  │    ├── Senior Designer
 *  │    │    ├── Middle Designer
 *  │    │    │    └── Junior Designer
 *  │    ├── Marketing Specialist
 *  │    └── Sales Specialist
 */
export const POSITION_HIERARCHY_SEED_DATA: PositionHierarchySeed[] = [
    // CEO's direct reports
    { superiorPosition: 'CEO', subordinatePosition: 'CTO' },
    { superiorPosition: 'CEO', subordinatePosition: 'COO' },
    { superiorPosition: 'CEO', subordinatePosition: 'CFO' },
    { superiorPosition: 'CEO', subordinatePosition: 'CMO' },

    // CTO hierarchy - Engineering Teams
    { superiorPosition: 'CTO', subordinatePosition: 'Team Lead' },
    { superiorPosition: 'Team Lead', subordinatePosition: 'Tech Lead' },

    // Software Engineering hierarchy
    { superiorPosition: 'Tech Lead', subordinatePosition: 'Senior Software Engineer' },
    { superiorPosition: 'Senior Software Engineer', subordinatePosition: 'Middle Software Engineer' },
    { superiorPosition: 'Middle Software Engineer', subordinatePosition: 'Junior Software Engineer' },

    // QA hierarchy
    { superiorPosition: 'Tech Lead', subordinatePosition: 'Senior QA Engineer' },
    { superiorPosition: 'Senior QA Engineer', subordinatePosition: 'Middle QA Engineer' },
    { superiorPosition: 'Middle QA Engineer', subordinatePosition: 'Junior QA Engineer' },

    // COO hierarchy - Operations
    { superiorPosition: 'COO', subordinatePosition: 'HR Director' },
    { superiorPosition: 'HR Director', subordinatePosition: 'HR Manager' },
    { superiorPosition: 'HR Manager', subordinatePosition: 'HR Specialist' },
    { superiorPosition: 'COO', subordinatePosition: 'Support Specialist' },

    // CFO hierarchy - Finance
    { superiorPosition: 'CFO', subordinatePosition: 'Finance Specialist' },

    // CMO hierarchy - Marketing and Design
    { superiorPosition: 'CMO', subordinatePosition: 'Senior Designer' },
    { superiorPosition: 'Senior Designer', subordinatePosition: 'Middle Designer' },
    { superiorPosition: 'Middle Designer', subordinatePosition: 'Junior Designer' },
    { superiorPosition: 'CMO', subordinatePosition: 'Marketing Specialist' },
    { superiorPosition: 'CMO', subordinatePosition: 'Sales Specialist' },
];

export default async function seedPositionHierarchy(
    prisma: PrismaClient,
    positionMap: PositionMap,
): Promise<void> {
    for (const hierarchy of POSITION_HIERARCHY_SEED_DATA) {
        const superiorId = positionMap.get(hierarchy.superiorPosition)?.id;
        const subordinateId = positionMap.get(hierarchy.subordinatePosition)?.id;

        if (!superiorId || !subordinateId) {
            console.warn(`⚠️ Cannot create hierarchy: ${hierarchy.superiorPosition} -> ${hierarchy.subordinatePosition}`);
            continue;
        }

        await prisma.positionHierarchy.upsert({
            where: {
                superiorPositionId_subordinatePositionId: {
                    superiorPositionId: superiorId,
                    subordinatePositionId: subordinateId,
                },
            },
            update: {},
            create: {
                superiorPositionId: superiorId,
                subordinatePositionId: subordinateId,
            },
        });
    }
}
