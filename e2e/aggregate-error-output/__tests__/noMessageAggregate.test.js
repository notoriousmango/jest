const {afterAll, expect, it} = require('@jest/globals');

afterAll(() => {
  const errors = [new Error('Standalone error')];
  return Promise.reject(new AggregateError(errors));
});

it('should pass', () => {
  expect(true).toBe(true);
});
