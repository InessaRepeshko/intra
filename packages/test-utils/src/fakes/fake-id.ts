let counter = 1;

export const fakeId = () => counter++;

export const resetFakeId = () => {
  counter = 1;
};
