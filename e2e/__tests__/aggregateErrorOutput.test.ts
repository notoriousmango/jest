/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {extractSummary} from '../Utils';
import runJest from '../runJest';

describe('AggregateError console output', () => {
  it('should display individual error details in console output for afterAll failures', () => {
    const {stderr, exitCode} = runJest('aggregate-error-output', [
      'aggregateError.test.js',
    ]);
    const {rest} = extractSummary(stderr);

    expect(exitCode).toBe(1); // Test should fail due to afterAll error
    expect(rest).toMatchSnapshot();
  });

  it('should handle AggregateError without main message', () => {
    const {stderr, exitCode} = runJest('aggregate-error-output', [
      'noMessageAggregate.test.js',
    ]);
    const {rest} = extractSummary(stderr);

    expect(exitCode).toBe(1);
    expect(rest).toMatchSnapshot();
  });

  it('should handle an AggregateError with empty Error list', () => {
    const {stderr, exitCode} = runJest('aggregate-error-output', [
      'emptyAggregate.test.js',
    ]);
    const {rest} = extractSummary(stderr);

    expect(exitCode).toBe(1);
    expect(rest).toMatchSnapshot();
  });
});
