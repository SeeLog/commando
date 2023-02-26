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
      };
    };
    return {
      getOutputChannel: getOutputChannel,
      outputResult: outputResult,
    };
  };

  const getTerminalMock = () => {
    // mock getTerminal
    const terminalSentTextList: string[] = [];
    const getTerminal = () => {
      return {
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
        sendText: (text: string) => {
          terminalSentTextList.push(text);
        },
        processId: (async () => 1)(),
        creationOptions: {},
        exitStatus: {
          code: 0,
          reason: 0,
        },
        state: {
          isInteractedWith: false,
        },
      };
    };
    return {
      getTerminal: getTerminal,
      terminalSentTextList: terminalSentTextList,
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
    assert.strictEqual(mock.outputResult[0], 'test from test');
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

  test('Make sure runCommandInTerminal', async () => {
    const mock = getTerminalMock();
    sinon.stub(logger, 'getTerminal').callsFake(mock.getTerminal);
    await command.runCommandInTerminal(commandObj, configObj);
    assert.strictEqual(mock.terminalSentTextList.length, 2);
    assert.strictEqual(mock.terminalSentTextList[0], 'clear');
    assert.strictEqual(mock.terminalSentTextList[1], 'echo "test from test"');
  });

  test('Make sure getAutoFocus', () => {
    // default true
    assert.strictEqual(command.getAutoFocus(commandObj, configObj), true);
    // command: default, config: false -> false
    assert.strictEqual(command.getAutoFocus(commandObj, { ...configObj, autoFocus: false }), false);
    // command: true, config: false -> true
    assert.strictEqual(
      command.getAutoFocus({ ...commandObj, autoFocus: true }, { ...configObj, autoFocus: false }),
      true
    );
    // command: false, config: true -> false
    assert.strictEqual(
      command.getAutoFocus({ ...commandObj, autoFocus: false }, { ...configObj, autoFocus: true }),
      false
    );
    // command: true, config: true -> true
    assert.strictEqual(
      command.getAutoFocus({ ...commandObj, autoFocus: true }, { ...configObj, autoFocus: true }),
      true
    );
    // command: false, config: default -> false
    assert.strictEqual(command.getAutoFocus({ ...commandObj, autoFocus: false }, configObj), false);
  });

  test('Make sure getAutoClear', () => {
    // default true
    assert.strictEqual(command.getAutoClear(commandObj, configObj), true);
    // command: default, config: false -> false
    assert.strictEqual(command.getAutoClear(commandObj, { ...configObj, autoClear: false }), false);
    // command: true, config: false -> true
    assert.strictEqual(
      command.getAutoClear({ ...commandObj, autoClear: true }, { ...configObj, autoClear: false }),
      true
    );
    // command: false, config: true -> false
    assert.strictEqual(
      command.getAutoClear({ ...commandObj, autoClear: false }, { ...configObj, autoClear: true }),
      false
    );
    // command: true, config: true -> true
    assert.strictEqual(
      command.getAutoClear({ ...commandObj, autoClear: true }, { ...configObj, autoClear: true }),
      true
    );
    // command: false, config: default -> false
    assert.strictEqual(command.getAutoClear({ ...commandObj, autoClear: false }, configObj), false);
  });
});
