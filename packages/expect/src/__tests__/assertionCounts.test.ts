/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {alignedAnsiStyleSerializer} from '@jest/test-utils';
import jestExpect from '../';

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

describe('.assertions()', () => {
  it('does not throw', () => {
    jestExpect.assertions(2);
    jestExpect('a').not.toBe('b');
    jestExpect('a').toBe('a');
  });

  it('redeclares different assertion count', () => {
    jestExpect.assertions(3);
    jestExpect('a').not.toBe('b');
    jestExpect('a').toBe('a');
    jestExpect.assertions(2);
  });
  it('expects no assertions', () => {
    jestExpect.assertions(0);
  });
});

describe('.hasAssertions()', () => {
  it('does not throw if there is an assertion', () => {
    jestExpect.hasAssertions();
    jestExpect('a').toBe('a');
  });

  it('throws if expected is not undefined', () => {
    expect(() => {
      // @ts-expect-error
      jestExpect.hasAssertions(2);
    }).toThrowErrorMatchingSnapshot();
  });

  it('hasAssertions not leaking to global state', () => {});
});

describe('interaction between .assertions(0) and .hasAssertions()', () => {
  it('assertions(0) should override hasAssertions()', () => {
    jestExpect.hasAssertions();
    jestExpect.assertions(0);

    const errors = jestExpect.extractExpectedAssertionsErrors();
    expect(errors).toHaveLength(0);
  });

  it('assertions(0) should override hasAssertions() regardless of call order', () => {
    jestExpect.assertions(0);
    jestExpect.hasAssertions();

    const errors = jestExpect.extractExpectedAssertionsErrors();
    expect(errors).toHaveLength(0);
  });

  it('hasAssertions() should still fail when assertions(1) is set but no assertions made', () => {
    jestExpect.hasAssertions();
    jestExpect.assertions(1);

    const errors = jestExpect.extractExpectedAssertionsErrors();
    expect(errors).toHaveLength(2);
    // First error should be from assertions(1)
    expect(errors[0].expected).toBe('1');
    expect(errors[0].actual).toBe('0');
    // Second error should be from hasAssertions()
    expect(errors[1].expected).toBe('at least one');
    expect(errors[1].actual).toBe('none');
  });

  it('hasAssertions() should still fail when no assertions() is called', () => {
    jestExpect.hasAssertions();

    const errors = jestExpect.extractExpectedAssertionsErrors();
    expect(errors).toHaveLength(1);
    expect(errors[0].expected).toBe('at least one');
    expect(errors[0].actual).toBe('none');
  });

  it('assertions(0) alone should pass with no assertions', () => {
    jestExpect.assertions(0);

    const errors = jestExpect.extractExpectedAssertionsErrors();
    expect(errors).toHaveLength(0);
  });
});

describe('numPassingAsserts', () => {
  it('verify the default value of numPassingAsserts', () => {
    const {numPassingAsserts} = jestExpect.getState();
    expect(numPassingAsserts).toBe(0);
  });

  it('verify the resetting of numPassingAsserts after a test', () => {
    expect('a').toBe('a');
    expect('a').toBe('a');
    // reset state
    jestExpect.extractExpectedAssertionsErrors();
    const {numPassingAsserts} = jestExpect.getState();
    expect(numPassingAsserts).toBe(0);
  });

  it('verify the correctness of numPassingAsserts count for passing test', () => {
    expect('a').toBe('a');
    expect('a').toBe('a');
    const {numPassingAsserts} = jestExpect.getState();
    expect(numPassingAsserts).toBe(2);
  });

  it('verify the correctness of numPassingAsserts count for failing test', () => {
    expect('a').toBe('a');
    try {
      expect('a').toBe('b');
    } catch {}
    const {numPassingAsserts} = jestExpect.getState();
    expect(numPassingAsserts).toBe(1);
  });
});
