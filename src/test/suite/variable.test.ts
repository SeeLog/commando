import * as vscode from 'vscode';
import * as assert from 'assert';
import { convertPlaceholder } from '../../variable';
import path = require('path');

suite('Variable Test Suite', () => {
  test('Make sure convert placeholder properly', async () => {
    const templateTextList = [
      '${commandName}',
      '${commandCmd}',
      '${workspaceFolder}',
      '${workspaceFolderBasename}',
      '${homeDir}',
      '${tmpDir}',
      '${platform}',
      '${file}',
      '${fileBasename}',
      '${fileExtname}',
      '${fileBasenameWithoutExt}',
      '${fileDirName}',
      '${relativeFile}',
    ];
    const templateTextList2 = [
      '${lineNumber}',
      '${lineNumbers}',
      '${columnNumber}',
      '${columnNumbers}',
      '${selectedText}',
      '${selectedTexts}',
    ];
    const command = {
      name: 'test',
      description: 'test',
      cmd: 'echo "test"',
    };
    const config = {
      commands: [command],
      autoClear: true,
      autoFocus: true,
    };
    // open file
    const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath ?? '';
    const testTextPath = path.join(workspacePath, 'test.txt');
    await vscode.workspace.openTextDocument(testTextPath).then((document) => {
      vscode.window.showTextDocument(document);
      if (!document) {
        assert.fail('No active document');
      }
      for (const text of templateTextList) {
        const result = convertPlaceholder(text, command, config, document);
        assert.equal(result.length > 0, true, `Result should not be empty: ${text}`);
      }
      for (const text of templateTextList2) {
        const result = convertPlaceholder(text, command, config, document);
        assert.equal(result !== undefined && result !== null, true, `Result should not be undefined/null: ${text}`);
      }
    });
  });
});
