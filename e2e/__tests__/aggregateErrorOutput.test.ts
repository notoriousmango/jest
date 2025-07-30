/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import {cleanup, extractSummary, writeFiles} from '../Utils';
import runJest from '../runJest';

const DIR = path.resolve(__dirname, '../aggregate-error-output');

beforeEach(() => cleanup(DIR));
afterAll(() => cleanup(DIR));

describe('AggregateError console output', () => {
  it('should display individual error details in console output for afterAll failures', () => {
    writeFiles(DIR, {
      '__tests__/aggregateError.test.js': `
        const {afterAll, expect, it} = require('@jest/globals');

        const errors = [
          new Error('Database connection timeout'),
          new TypeError('Invalid configuration type'),
          new ReferenceError('Missing required dependency'),
          new Error('Network request failed'),
        ];

        afterAll(() => {
          return Promise.reject(
            new AggregateError(errors, 'Multiple system failures during cleanup')
          );
        });

        it('should pass but afterAll will show AggregateError details', () => {
          expect(true).toBe(true);
        });
      `,
      'package.json': JSON.stringify({
        jest: {testEnvironment: 'node'},
      }),
    });

    const {exitCode, stderr} = runJest(DIR);
    const {summary} = extractSummary(stderr);

    expect(exitCode).toBe(1); // Test should fail due to afterAll error
    expect(summary).toMatchSnapshot();
  });

  it('should handle AggregateError without main message', () => {
    writeFiles(DIR, {
      '__tests__/noMessageAggregate.test.js': `
        const {afterAll, expect, it} = require('@jest/globals');

        afterAll(() => {
          const errors = [new Error('Standalone error')];
          return Promise.reject(new AggregateError(errors));
        });

        it('should pass', () => {
          expect(true).toBe(true);
        });
      `,
      'package.json': JSON.stringify({
        jest: {testEnvironment: 'node'},
      }),
    });

    const {exitCode, stderr} = runJest(DIR);
    const {summary} = extractSummary(stderr);

    expect(exitCode).toBe(1);
    expect(summary).toMatchSnapshot();
  });

  it('should handle an AggregateError with empty Error list', () => {
    writeFiles(DIR, {
      '__tests__/emptyAggregate.test.js': `
        const {afterAll, expect, it} = require('@jest/globals');

        afterAll(() => {
          return Promise.reject(new AggregateError([], 'Empty error collection'));
        });

        it('should pass', () => {
          expect(true).toBe(true);
        });
      `,
      'package.json': JSON.stringify({
        jest: {testEnvironment: 'node'},
      }),
    });

    const {exitCode, stderr} = runJest(DIR);
    const {summary} = extractSummary(stderr);

    expect(exitCode).toBe(1);
    expect(summary).toMatchSnapshot();
  });
});
