import { PrismaClient, Position, Team, users_status, User } from '@prisma/client';
import { pbkdf2Sync, randomBytes } from 'crypto';

function hashPassword(password: string): string {
    const iterations = 120_000;
    const keylen = 32;
    const digest = 'sha256';
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(
      password,
      salt,
      iterations,
      keylen,
      digest,
    ).toString('hex');

    return `pbkdf2_sha256$${iterations}$${salt}$${hash}`;
}

export default async function seedUsers(prisma: PrismaClient, positions: Position[], teams: Team[]) {
    const getPositionId = (title: string) => {
        const pos = positions.find((p) => p.title === title);
        if (!pos) throw new Error(`Position not found: ${title}`);
        return pos.id;
    };

    const getTeamId = (title: string) => {
        const team = teams.find((t) => t.title === title);
        if (!team) throw new Error(`Team not found: ${title}`);
        return team.id;
    };

    const defaultPasswordHash = hashPassword('Str0ngP@ssw0rd!');

    const usersData = [
        // Head Office
        {
            firstName: 'Oleksandr',
            secondName: 'Mykolayovych',
            lastName: 'Bondarenko',
            email: 'oleksandr.bondarenko@intra.com',
            position: 'CEO',
            team: 'Head Office',
        },
        {
            firstName: 'Dmytro',
            secondName: 'Oleksandrovych',
            lastName: 'Kovalenko',
            email: 'dmytro.kovalenko@intra.com',
            position: 'CTO',
            team: 'Head Office',
        },
        {
            firstName: 'Iryna',
            secondName: 'Volodymyrivna',
            lastName: 'Shevchenko',
            email: 'iryna.shevchenko@intra.com',
            position: 'COO',
            team: 'Head Office',
        },
        {
            firstName: 'Olena',
            secondName: 'Serhiivna',
            lastName: 'Boyko',
            email: 'olena.boyko@intra.com',
            position: 'CFO',
            team: 'Head Office',
        },
        {
            firstName: 'Andrii',
            secondName: 'Petrovych',
            lastName: 'Melnyk',
            email: 'andrii.melnyk@intra.com',
            position: 'CMO',
            team: 'Head Office',
        },
        // HR Team
        {
            firstName: 'Natalya',
            secondName: 'Viktorivna',
            lastName: 'Tkachenko',
            email: 'natalya.tkachenko@intra.com',
            position: 'HR Director',
            team: 'HR Team',
        },
        {
            firstName: 'Mariia',
            secondName: 'Ivanivna',
            lastName: 'Pavlenko',
            email: 'mariia.pavlenko@intra.com',
            position: 'HR Manager',
            team: 'HR Team',
        },
        {
            firstName: 'Yulia',
            secondName: 'Dmytrivna',
            lastName: 'Kravchenko',
            email: 'yulia.kravchenko@intra.com',
            position: 'HR Specialist',
            team: 'HR Team',
        },
        // SE Team
        {
            firstName: 'Serhii',
            secondName: 'Olehovych',
            lastName: 'Oliinyk',
            email: 'serhii.oliinyk@intra.com',
            position: 'Team Lead',
            team: 'SE Team',
        },
        {
            firstName: 'Pavlo',
            secondName: 'Ihorovych',
            lastName: 'Lytvyn',
            email: 'pavlo.lytvyn@intra.com',
            position: 'Tech Lead',
            team: 'SE Team',
        },
        {
            firstName: 'Taras',
            secondName: 'Andriiovych',
            lastName: 'Rudenko',
            email: 'taras.rudenko@intra.com',
            position: 'Senior Software Engineer',
            team: 'SE Team',
        },
        {
            firstName: 'Petro',
            secondName: 'Mykhailovych',
            lastName: 'Koval',
            email: 'petro.koval@intra.com',
            position: 'Senior Software Engineer',
            team: 'SE Team',
        },
        {
            firstName: 'Ivan',
            secondName: 'Yuriyovych',
            lastName: 'Sydorenko',
            email: 'ivan.sydorenko@intra.com',
            position: 'Middle Software Engineer',
            team: 'SE Team',
        },
        {
            firstName: 'Yevhenii',
            secondName: 'Volodymyrovych',
            lastName: 'Tkachuk',
            email: 'yevhenii.tkachuk@intra.com',
            position: 'Middle Software Engineer',
            team: 'SE Team',
        },
        {
            firstName: 'Mykola',
            secondName: 'Stepanovych',
            lastName: 'Petrenko',
            email: 'mykola.petrenko@intra.com',
            position: 'Junior Software Engineer',
            team: 'SE Team',
        },
        // QA Team
        {
            firstName: 'Viktoria',
            secondName: 'Vitaliivna',
            lastName: 'Moroz',
            email: 'viktoria.moroz@intra.com',
            position: 'Team Lead', // Using Team Lead as generic lead for QA team
            team: 'QA Team',
        },
        {
            firstName: 'Oksana',
            secondName: 'Vasylivna',
            lastName: 'Savchenko',
            email: 'oksana.savchenko@intra.com',
            position: 'Senior QA Engineer',
            team: 'QA Team',
        },
        {
            firstName: 'Tetiana',
            secondName: 'Borysivna',
            lastName: 'Bondar',
            email: 'tetiana.bondar@intra.com',
            position: 'Middle QA Engineer',
            team: 'QA Team',
        },
        {
            firstName: 'Vasyl',
            secondName: 'Hryhorovych',
            lastName: 'Lysenko',
            email: 'vasyl.lysenko@intra.com',
            position: 'Junior QA Engineer',
            team: 'QA Team',
        },
        // Design Team
        {
            firstName: 'Olga',
            secondName: 'Anatoliivna',
            lastName: 'Ivanchuk',
            email: 'olga.ivanchuk@intra.com',
            position: 'Senior Designer',
            team: 'Design Team',
        },
        {
            firstName: 'Kateryna',
            secondName: 'Romanivna',
            lastName: 'Romanchuk',
            email: 'kateryna.romanchuk@intra.com',
            position: 'Middle Designer',
            team: 'Design Team',
        },
        // Sales Team
        {
            firstName: 'Mykhailo',
            secondName: 'Kostiantynovych',
            lastName: 'Kozak',
            email: 'mykhailo.kozak@intra.com',
            position: 'Sales Specialist',
            team: 'Sales Team',
        },
        // Marketing Team
        {
            firstName: 'Anastasia',
            secondName: 'Oleksivna',
            lastName: 'Polishchuk',
            email: 'anastasia.polishchuk@intra.com',
            position: 'Marketing Specialist',
            team: 'Marketing Team',
        },
        // Support Team
        {
            firstName: 'Volodymyr',
            secondName: 'Mykolayovych',
            lastName: 'Gavrylyuk',
            email: 'volodymyr.gavrylyuk@intra.com',
            position: 'Support Specialist',
            team: 'Support Team',
        },
        // Finance Team
        {
            firstName: 'Ludmyla',
            secondName: 'Petrivna',
            lastName: 'Panasenko',
            email: 'ludmyla.panasenko@intra.com',
            position: 'Finance Specialist',
            team: 'Finance Team',
        },
    ];

    const results: User[] = [];

    for (const u of usersData) {
        const result = await prisma.user.upsert({
            where: { email: u.email },
            update: {
                firstName: u.firstName,
                secondName: u.secondName,
                lastName: u.lastName,
                fullName: `${u.firstName} ${u.secondName ? u.secondName + ' ' : ''}${u.lastName}`,
                positionId: getPositionId(u.position),
                teamId: getTeamId(u.team),
                status: users_status.ACTIVE,
                passwordHash: defaultPasswordHash,
            },
            create: {
                firstName: u.firstName,
                secondName: u.secondName,
                lastName: u.lastName,
                fullName: `${u.firstName} ${u.secondName ? u.secondName + ' ' : ''}${u.lastName}`,
                email: u.email,
                positionId: getPositionId(u.position),
                teamId: getTeamId(u.team),
                status: users_status.ACTIVE,
                passwordHash: defaultPasswordHash,
            },
        });
        results.push(result);
    }
    
    return results;
}
