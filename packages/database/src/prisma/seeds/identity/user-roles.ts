import {
    PrismaClient,
    IdentityRole as PrismaIdentityRole,
} from '@intra/database';
import { IdentityRole } from '@intra/shared-kernel';

export default async function seedUserRoles(prisma: PrismaClient) {
    const data = Object.values(IdentityRole).map((val) => {
        const role = val as unknown as PrismaIdentityRole;
        return {
            code: role,
            title: role.toString(),
            description: `Role ${role}`,
        };
    });

    for (const role of data) {
        await prisma.role.upsert({
            where: { code: role.code },
            update: role,
            create: role,
        });
    }
}
