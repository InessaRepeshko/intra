import { UserDomain } from 'apps/api/src/modules/identity/domain/user/user.domain';
import { UsersStatus } from 'apps/api/src/modules/identity/domain/user/users-status.enum';
import { fakeId } from '@test-utils/fakes/fake-id';
import { fakeDate } from '@test-utils/fakes/fake-date';

type Overrides = Partial<ConstructorParameters<typeof UserDomain>[0]>;

export const userBuilder = (overrides: Overrides = {}) => {
  const firstName = overrides.firstName || 'Oleksandr';
  const secondName = overrides.secondName || 'Oleksandrovich';
  const lastName = overrides.lastName || 'Khomenko';
  const fullName = `${firstName} ${secondName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

  return new UserDomain({
    id: fakeId(),
    firstName,
    secondName,
    lastName,
    fullName,
    email,
    passwordHash: 'hashed-password',
    status: UsersStatus.ACTIVE,
    positionId: 1,
    teamId: 1,
    managerId: null,
    createdAt: fakeDate(),
    updatedAt: fakeDate(),
    ...overrides,
  });
};
