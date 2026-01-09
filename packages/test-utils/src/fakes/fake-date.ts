let date: Date = new Date('2026-01-01T00:00:00Z');

export const fakeDate = () => date;

export const advanceDays = (days: number) => {
  date = new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
};

export const resetFakeDate = () => {
  date = new Date('2026-01-01T00:00:00Z');
};
