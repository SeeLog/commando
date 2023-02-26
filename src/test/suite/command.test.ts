import * as assert from 'assert';
import * as sinon from 'sinon';
import { ICommand, IConfig } from '../../interface';
import * as command from '../../command';
import * as logger from '../../logger';

suite('Command test', function () {
  this.afterEach(() => {
    sinon.restore();
  });

  const commandObj: ICommand = {
    name: 'test',
    cmd: 'echo "test from test"',
  };
  const configObj: IConfig = {
    windowName: 'test',
    commands: [commandObj],
  };

  const getOutputChannelMock = () => {
    // mock getOutputChannel
    const outputResult: string[] = [];
    const getOutputChannel = () => {
      return {
        append: (text: string) => {
          outputResult.push(text);
        },
        appendLine: (text: string) => {
          outputResult.push(text);
        },
        clear: () => {
          outputResult.length = 0;
        },
        show: () => {
          // do nothing
        },
        hide: () => {
          // do nothing
        },
        dispose: () => {
          // do nothing
        },
        name: 'test',
        replace: () => {
          // do nothing
        },
        getResult: () => {
          return outputResult;
        },
      };
    };
    return {
      getOutputChannel: getOutputChannel,
      outputResult: outputResult,
    };
  };

  test('Make sure getWindowName', () => {
    assert.strictEqual(command.getWindowName(commandObj, configObj), 'test');
    assert.strictEqual(command.getWindowName(commandObj, { ...configObj, windowName: undefined }), 'Commando test');
  });

  test('Make sure runCommandInOutputChannel', async () => {
    const mock = getOutputChannelMock();
    sinon.stub(logger, 'getOutputChannel').callsFake(mock.getOutputChannel);
    await command.runCommandInOutputChannel(commandObj, configObj);
    assert.strictEqual(mock.outputResult.length, 2);
    assert.strictEqual(mock.outputResult[0], 'test from test\n');
    assert.strictEqual(mock.outputResult[1], 'Commando done.');
  });

  test('Make sure runCommandInOutputChannel with status code 1', async () => {
    const mock = getOutputChannelMock();
    sinon.stub(logger, 'getOutputChannel').callsFake(mock.getOutputChannel);
    await command.runCommandInOutputChannel({ ...commandObj, cmd: 'exit 1' }, configObj);
    assert.strictEqual(mock.outputResult.length, 2);
    assert.strictEqual(mock.outputResult[0], 'Command exited with code 1');
    assert.strictEqual(mock.outputResult[1], 'Commando done.');
  });

  test('Make sure runCommandInOutputChannel with multi-byte output', async () => {
    const mock = getOutputChannelMock();
    sinon.stub(logger, 'getOutputChannel').callsFake(mock.getOutputChannel);
    await command.runCommandInOutputChannel({ ...commandObj, cmd: 'echo "こんにちは"' }, configObj);
    assert.strictEqual(mock.outputResult.length, 2);
    assert.strictEqual(mock.outputResult[0], 'こんにちは\n');
    assert.strictEqual(mock.outputResult[1], 'Commando done.');
  });
});
