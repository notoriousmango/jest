const {afterAll, expect, it} = require('@jest/globals');

const errors = [
  new Error('simple error'),
  new TypeError('type error'),
  new ReferenceError('reference error'),
  new Error('another simple error'),
];

afterAll(() => {
  return Promise.reject(new AggregateError(errors, 'Multiple errors occurred'));
});

it('should pass', () => {
  expect(true).toBe(true);
});
