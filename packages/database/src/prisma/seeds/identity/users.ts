import { PrismaClient, IdentityRole as PrismaIdentityRole } from '@intra/database';
import { pbkdf2Sync, randomBytes } from 'crypto';
import type { PositionMap } from '../organisation/positions';
import type { TeamMap } from '../organisation/teams';
import { IdentityRole } from '@intra/shared-kernel';

export type UserMap = Map<string, { id: number }>;

export type UserSeed = {
    firstName: string;
    secondName?: string | null;
    lastName: string;
    email: string;
    position: string;
    team: string;
    roles: IdentityRole[];
    managerEmail?: string | null;
    password?: string;
    isPrimaryMember?: boolean;
};

export const DEFAULT_USER_PASSWORD = 'Str0ngP@ssw0rd!';

export const USER_SEED_DATA: UserSeed[] = [
    // Head Office
    {
        firstName: 'Oleksandr',
        secondName: 'Mykolayovych',
        lastName: 'Bondarenko',
        email: 'oleksandr.bondarenko@intra.com',
        position: 'CEO',
        team: 'Head Office',
        roles: [IdentityRole.ADMIN, IdentityRole.MANAGER],
    },
    {
        firstName: 'Dmytro',
        secondName: 'Oleksandrovych',
        lastName: 'Kovalenko',
        email: 'dmytro.kovalenko@intra.com',
        position: 'CTO',
        team: 'Head Office',
        roles: [IdentityRole.MANAGER],
        managerEmail: 'oleksandr.bondarenko@intra.com',
    },
    {
        firstName: 'Iryna',
        secondName: 'Volodymyrivna',
        lastName: 'Shevchenko',
        email: 'iryna.shevchenko@intra.com',
        position: 'COO',
        team: 'Head Office',
        roles: [IdentityRole.MANAGER],
        managerEmail: 'oleksandr.bondarenko@intra.com',
    },
    {
        firstName: 'Olena',
        secondName: 'Serhiivna',
        lastName: 'Boyko',
        email: 'olena.boyko@intra.com',
        position: 'CFO',
        team: 'Head Office',
        roles: [IdentityRole.MANAGER],
        managerEmail: 'oleksandr.bondarenko@intra.com',
    },
    {
        firstName: 'Andrii',
        secondName: 'Petrovych',
        lastName: 'Melnyk',
        email: 'andrii.melnyk@intra.com',
        position: 'CMO',
        team: 'Head Office',
        roles: [IdentityRole.MANAGER],
        managerEmail: 'oleksandr.bondarenko@intra.com',
    },
    // HR Team
    {
        firstName: 'Natalya',
        secondName: 'Viktorivna',
        lastName: 'Tkachenko',
        email: 'natalya.tkachenko@intra.com',
        position: 'HR Director',
        team: 'HR Team',
        roles: [IdentityRole.HR, IdentityRole.MANAGER],
        managerEmail: 'iryna.shevchenko@intra.com',
    },
    {
        firstName: 'Mariia',
        secondName: 'Ivanivna',
        lastName: 'Pavlenko',
        email: 'mariia.pavlenko@intra.com',
        position: 'HR Manager',
        team: 'HR Team',
        roles: [IdentityRole.HR],
        managerEmail: 'natalya.tkachenko@intra.com',
    },
    {
        firstName: 'Yulia',
        secondName: 'Dmytrivna',
        lastName: 'Kravchenko',
        email: 'yulia.kravchenko@intra.com',
        position: 'HR Specialist',
        team: 'HR Team',
        roles: [IdentityRole.HR],
        managerEmail: 'mariia.pavlenko@intra.com',
    },
    // SE Team
    {
        firstName: 'Serhii',
        secondName: 'Olehovych',
        lastName: 'Oliinyk',
        email: 'serhii.oliinyk@intra.com',
        position: 'Team Lead',
        team: 'SE Team',
        roles: [IdentityRole.MANAGER],
        managerEmail: 'dmytro.kovalenko@intra.com',
    },
    {
        firstName: 'Pavlo',
        secondName: 'Ihorovych',
        lastName: 'Lytvyn',
        email: 'pavlo.lytvyn@intra.com',
        position: 'Tech Lead',
        team: 'SE Team',
        roles: [IdentityRole.MANAGER],
        managerEmail: 'serhii.oliinyk@intra.com',
    },
    {
        firstName: 'Taras',
        secondName: 'Andriiovych',
        lastName: 'Rudenko',
        email: 'taras.rudenko@intra.com',
        position: 'Senior Software Engineer',
        team: 'SE Team',
        roles: [IdentityRole.EMPLOYEE],
        managerEmail: 'pavlo.lytvyn@intra.com',
    },
    {
        firstName: 'Petro',
        secondName: 'Mykhailovych',
        lastName: 'Koval',
        email: 'petro.koval@intra.com',
        position: 'Senior Software Engineer',
        team: 'SE Team',
        roles: [IdentityRole.EMPLOYEE],
        managerEmail: 'pavlo.lytvyn@intra.com',
    },
    {
        firstName: 'Ivan',
        secondName: 'Yuriyovych',
        lastName: 'Sydorenko',
        email: 'ivan.sydorenko@intra.com',
        position: 'Middle Software Engineer',
        team: 'SE Team',
        roles: [IdentityRole.EMPLOYEE],
        managerEmail: 'pavlo.lytvyn@intra.com',
    },
    {
        firstName: 'Yevhenii',
        secondName: 'Volodymyrovych',
        lastName: 'Tkachuk',
        email: 'yevhenii.tkachuk@intra.com',
        position: 'Middle Software Engineer',
        team: 'SE Team',
        roles: [IdentityRole.EMPLOYEE],
        managerEmail: 'pavlo.lytvyn@intra.com',
    },
    {
        firstName: 'Mykola',
        secondName: 'Stepanovych',
        lastName: 'Petrenko',
        email: 'mykola.petrenko@intra.com',
        position: 'Junior Software Engineer',
        team: 'SE Team',
        roles: [IdentityRole.EMPLOYEE],
        managerEmail: 'ivan.sydorenko@intra.com',
    },
    // QA Team
    {
        firstName: 'Viktoria',
        secondName: 'Vitaliivna',
        lastName: 'Moroz',
        email: 'viktoria.moroz@intra.com',
        position: 'Team Lead',
        team: 'QA Team',
        roles: [IdentityRole.MANAGER],
        managerEmail: 'dmytro.kovalenko@intra.com',
    },
    {
        firstName: 'Oksana',
        secondName: 'Vasylivna',
        lastName: 'Savchenko',
        email: 'oksana.savchenko@intra.com',
        position: 'Senior QA Engineer',
        team: 'QA Team',
        roles: [IdentityRole.EMPLOYEE],
        managerEmail: 'viktoria.moroz@intra.com',
    },
    {
        firstName: 'Tetiana',
        secondName: 'Borysivna',
        lastName: 'Bondar',
        email: 'tetiana.bondar@intra.com',
        position: 'Middle QA Engineer',
        team: 'QA Team',
        roles: [IdentityRole.EMPLOYEE],
        managerEmail: 'viktoria.moroz@intra.com',
    },
    {
        firstName: 'Vasyl',
        secondName: 'Hryhorovych',
        lastName: 'Lysenko',
        email: 'vasyl.lysenko@intra.com',
        position: 'Junior QA Engineer',
        team: 'QA Team',
        roles: [IdentityRole.EMPLOYEE],
        managerEmail: 'viktoria.moroz@intra.com',
    },
    // Design Team
    {
        firstName: 'Olga',
        secondName: 'Anatoliivna',
        lastName: 'Ivanchuk',
        email: 'olga.ivanchuk@intra.com',
        position: 'Senior Designer',
        team: 'Design Team',
        roles: [IdentityRole.MANAGER],
        managerEmail: 'andrii.melnyk@intra.com',
    },
    {
        firstName: 'Kateryna',
        secondName: 'Romanivna',
        lastName: 'Romanchuk',
        email: 'kateryna.romanchuk@intra.com',
        position: 'Middle Designer',
        team: 'Design Team',
        roles: [IdentityRole.EMPLOYEE],
        managerEmail: 'olga.ivanchuk@intra.com',
    },
    // Sales Team
    {
        firstName: 'Mykhailo',
        secondName: 'Kostiantynovych',
        lastName: 'Kozak',
        email: 'mykhailo.kozak@intra.com',
        position: 'Sales Specialist',
        team: 'Sales Team',
        roles: [IdentityRole.MANAGER],
        managerEmail: 'iryna.shevchenko@intra.com',
    },
    // Marketing Team
    {
        firstName: 'Anastasia',
        secondName: 'Oleksivna',
        lastName: 'Polishchuk',
        email: 'anastasia.polishchuk@intra.com',
        position: 'Marketing Specialist',
        team: 'Marketing Team',
        roles: [IdentityRole.MANAGER],
        managerEmail: 'andrii.melnyk@intra.com',
    },
    // Support Team
    {
        firstName: 'Volodymyr',
        secondName: 'Mykolayovych',
        lastName: 'Gavrylyuk',
        email: 'volodymyr.gavrylyuk@intra.com',
        position: 'Support Specialist',
        team: 'Support Team',
        roles: [IdentityRole.MANAGER],
        managerEmail: 'iryna.shevchenko@intra.com',
    },
    // Finance Team
    {
        firstName: 'Ludmyla',
        secondName: 'Petrivna',
        lastName: 'Panasenko',
        email: 'ludmyla.panasenko@intra.com',
        position: 'Finance Specialist',
        team: 'Finance Team',
        roles: [IdentityRole.MANAGER],
        managerEmail: 'olena.boyko@intra.com',
    },
];

function buildFullName(user: UserSeed): string {
    const middle = user.secondName ? ` ${user.secondName}` : '';
    return `${user.firstName}${middle} ${user.lastName}`;
}

export function hashPassword(password: string): string {
    const iterations = 120_000;
    const keylen = 32;
    const digest = 'sha256';
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
    return `pbkdf2_sha256$${iterations}$${salt}$${hash}`;
}

export default async function seedUsers(
    prisma: PrismaClient,
    positionMap: PositionMap,
    teamMap: TeamMap,
): Promise<UserMap> {
    const users: UserMap = new Map();

    for (const user of USER_SEED_DATA) {
        const positionId = positionMap.get(user.position)?.id as number;
        const teamId = teamMap.get(user.team)?.id ?? null;
        const passwordHash = hashPassword(user.password ?? DEFAULT_USER_PASSWORD);
        const fullName = buildFullName(user);

        const record = await prisma.user.upsert({
            where: { email: user.email },
            update: {
                firstName: user.firstName,
                secondName: user.secondName ?? null,
                lastName: user.lastName,
                fullName,
                positionId,
                teamId,
                passwordHash,
            },
            create: {
                firstName: user.firstName,
                secondName: user.secondName ?? null,
                lastName: user.lastName,
                fullName,
                email: user.email,
                positionId,
                teamId,
                passwordHash,
            },
        });

        users.set(user.email, { id: record.id });

        for (const roleCode of user.roles) {
            const code = roleCode.toString().toUpperCase() as unknown as PrismaIdentityRole;
            await prisma.userRole.upsert({
                where: { userId_roleCode: { userId: record.id, roleCode: code } },
                update: {},
                create: { userId: record.id, roleCode: code },
            });
        }

        if (teamId) {
            const isPrimary = user.isPrimaryMember ?? true;
            await prisma.teamMembership.upsert({
                where: {
                    teamId_memberId_isPrimary: {
                        teamId,
                        memberId: record.id,
                        isPrimary,
                    },
                },
                update: {},
                create: {
                    teamId,
                    memberId: record.id,
                    isPrimary,
                },
            });
        }
    }

    for (const user of USER_SEED_DATA) {
        if (!user.managerEmail) continue;

        const current = users.get(user.email);
        const manager = users.get(user.managerEmail);

        if (!current || !manager) {
            console.warn(`⚠️ Impossible to assign manager for ${user.email}`);
            continue;
        }

        await prisma.user.update({
            where: { id: current.id },
            data: { managerId: manager.id },
        });
    }

    return users;
}
