import * as assert from 'assert';
import * as vscode from 'vscode';
import { getConfig } from '../../config';

suite('Config Test Suite', async () => {
  test('Make sure config can load properly', async () => {
    vscode.workspace
      .getConfiguration()
      .update('commando.commands', [
        {
          name: 'Hello World',
          description: 'Prints Hello World to the console',
          cmd: 'echo "Hello World"',
        },
      ])
      .then(() => {
        const config = getConfig();
        assert.strictEqual(config.commands.length, 1);
        assert.strictEqual(config.commands[0].name, 'Hello World');
        assert.strictEqual(config.commands[0].description, 'Prints Hello World to the console');
      });
  });

  test('Make sure raise error when command name is duplicated', async () => {
    vscode.workspace
      .getConfiguration()
      .update('commando.commands', [
        {
          name: 'Hello World',
          description: 'Prints Hello World to the console',
          cmd: 'echo "Hello World"',
        },
        {
          name: 'Hello World',
          description: 'Something wrong',
          cmd: 'echo "Hello World"',
        },
      ])
      .then(() => {
        assert.throws(() => getConfig(), Error);
      });
  });
});
