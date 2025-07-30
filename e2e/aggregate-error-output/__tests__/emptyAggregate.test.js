const {afterAll, expect, it} = require('@jest/globals');

afterAll(() => {
  return Promise.reject(new AggregateError([], 'Empty error collection'));
});

it('should pass', () => {
  expect(true).toBe(true);
});
