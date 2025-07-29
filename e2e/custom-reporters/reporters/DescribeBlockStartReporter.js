/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/**
 * @class
 * @implements {import('@jest/reporters').Reporter}
 */
class DescribeBlockStartReporter {
  onDescribeBlockStart(test, describeBlockStartInfo) {
    const mode =
      describeBlockStartInfo.mode == null
        ? 'undefined'
        : describeBlockStartInfo.mode;
    console.log(
      `onDescribeBlockStart: ${describeBlockStartInfo.title}, ` +
        `mode: ${mode}, ` +
        `ancestorTitles: ${describeBlockStartInfo.ancestorTitles.join('.')}`,
    );
  }

  onDescribeBlockFinish(test, describeBlockStartInfo) {
    const mode =
      describeBlockStartInfo.mode == null
        ? 'undefined'
        : describeBlockStartInfo.mode;
    console.log(
      `onDescribeBlockFinish: ${describeBlockStartInfo.title}, ` +
        `mode: ${mode}, ` +
        `ancestorTitles: ${describeBlockStartInfo.ancestorTitles.join('.')}`,
    );
  }
}

module.exports = DescribeBlockStartReporter;
