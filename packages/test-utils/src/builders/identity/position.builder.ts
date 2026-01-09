import { PositionDomain } from '../../../../../apps/api/src/modules/identity/domain/position/position.domain';
import { fakeId } from '@test-utils/fakes/fake-id';
import { fakeDate } from '@test-utils/fakes/fake-date';

type Overrides = Partial<ConstructorParameters<typeof PositionDomain>[0]>;

export const positionBuilder = (overrides: Overrides = {}) => {
  return new PositionDomain({
    id: fakeId(),
    title: 'HR',
    description: 'Human Resources',
    createdAt: fakeDate(),
    updatedAt: fakeDate(),
    users: [],
    ...overrides,
  });
};
