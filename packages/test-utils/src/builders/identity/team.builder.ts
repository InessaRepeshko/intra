import { TeamDomain } from 'apps/api/src/modules/identity/domain/team/team.domain';
import { fakeId } from '@test-utils/fakes/fake-id';
import { fakeDate } from '@test-utils/fakes/fake-date';

type Overrides = Partial<ConstructorParameters<typeof TeamDomain>[0]>;

export const teamBuilder = (overrides: Overrides = {}) => {
  return new TeamDomain({
    id: fakeId(),
    title: 'HR Department',
    description: 'Human Resources Department',
    headId: null,
    createdAt: fakeDate(),
    updatedAt: fakeDate(),
    members: [],
    ...overrides,
  });
};
