import { positionBuilder } from '../../builders/identity/position.builder';

export const positionsFixture = () => {
  const hr = positionBuilder({ title: 'HR', description: 'Human Resources' });
  const dev = positionBuilder({ title: 'Software Engineer', description: 'Software Engineer' });
  const qa = positionBuilder({ title: 'QA Engineer', description: 'QA Engineer' });

  return { hr, dev, qa };
};
