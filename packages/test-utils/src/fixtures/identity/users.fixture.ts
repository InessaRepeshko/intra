import { userBuilder } from "@test-utils/builders/identity/user.builder";

export const usersFixture = () => {
  const hr = userBuilder({ firstName: 'Solomiia', lastName: 'Kazolyp', positionId: 1, teamId: 1 });
  const hr1 = userBuilder({ firstName: 'Solomiia', lastName: 'Kazolyp', positionId: 1, teamId: 1 });
  const hr2 = userBuilder({ firstName: 'Mariia', lastName: `O'Reilly`, positionId: 1, teamId: 1 });

  const dev = userBuilder({ firstName: 'Mykola', lastName: 'Shmundyr', positionId: 2, teamId: 2 });
  const dev1 = userBuilder({ firstName: 'Mykola', lastName: 'Shmundyr', positionId: 2, teamId: 2 });
  const dev2 = userBuilder({ firstName: 'Oleksandr', lastName: 'Khomenko', positionId: 2, teamId: 2 });
  const dev3 = userBuilder({ firstName: 'Valerii', lastName: 'Velychko', positionId: 2, teamId: 2 });
  const dev4 = userBuilder({ firstName: 'Alena', lastName: 'Yakimenko', positionId: 2, teamId: 2 });
  const dev5 = userBuilder({ firstName: 'Roman', lastName: 'Rohoza', positionId: 2, teamId: 2 });
  const dev6 = userBuilder({ firstName: 'Artur', lastName: 'Piskovskii', positionId: 2, teamId: 2 });

  const qa = userBuilder({ firstName: 'Viktor', lastName: 'Tkachenko', positionId: 3, teamId: 3 });
  const qa1 = userBuilder({ firstName: 'Viktor', lastName: 'Tkachenko', positionId: 3, teamId: 3 });
  const qa2 = userBuilder({ firstName: 'Oleksandr', lastName: 'Zaiika', positionId: 3, teamId: 3 });

  return { hr, hr1, hr2, dev, dev1, dev2, dev3, dev4, dev5, dev6, qa, qa1, qa2 };
}