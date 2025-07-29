/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {TestFileEvent} from '@jest/test-result';
import type {Circus} from '@jest/types';
import {ROOT_DESCRIBE_BLOCK_NAME} from './state';
import {
  createDescribeBlockStartInfo,
  createTestCaseStartInfo,
  makeSingleTestResult,
  parseSingleTestResult,
} from './utils';

const testCaseReportHandler =
  (testPath: string, sendMessageToJest: TestFileEvent) =>
  (event: Circus.Event): void => {
    switch (event.name) {
      case 'test_started': {
        const testCaseStartInfo = createTestCaseStartInfo(event.test);
        sendMessageToJest('test-case-start', [testPath, testCaseStartInfo]);
        break;
      }
      case 'test_todo':
      case 'test_done': {
        const testResult = makeSingleTestResult(event.test);
        const testCaseResult = parseSingleTestResult(testResult);
        sendMessageToJest('test-case-result', [testPath, testCaseResult]);
        break;
      }
      case 'run_describe_start': {
        if (event.describeBlock.name === ROOT_DESCRIBE_BLOCK_NAME) {
          break;
        }
        const describeBlockStartInfo = createDescribeBlockStartInfo(
          event.describeBlock,
        );
        sendMessageToJest('describe-block-start', [
          testPath,
          describeBlockStartInfo,
        ]);
        break;
      }
      case 'run_describe_finish': {
        if (event.describeBlock.name === ROOT_DESCRIBE_BLOCK_NAME) {
          break;
        }
        const describeBlockStartInfo = createDescribeBlockStartInfo(
          event.describeBlock,
        );
        sendMessageToJest('describe-block-finish', [
          testPath,
          describeBlockStartInfo,
        ]);
        break;
      }
    }
  };

export default testCaseReportHandler;
