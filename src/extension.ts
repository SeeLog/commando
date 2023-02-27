import * as vscode from 'vscode';
import { runCommand } from './command';
import { ICommand, IConfig, ISpecialCommand } from './interface';
import { getConfig, LoadConfigError } from './config';

export type PickerCommandItem = vscode.QuickPickItem & { commandoCommand: ICommand & ISpecialCommand };

export const activate = (context: vscode.ExtensionContext) => {
  let config: IConfig | undefined = undefined;
  let configError: LoadConfigError | undefined = undefined;
  try {
    config = getConfig();
  } catch (error) {
    if (error instanceof LoadConfigError) {
      vscode.window.showErrorMessage(error.message);
      configError = error;
    } else {
      throw error;
    }
  }

  vscode.workspace.onDidChangeConfiguration(() => {
    console.log('Commando configuration changed.');
    config = getConfig();
  });

  const disposable = vscode.commands.registerCommand('commando.runCommand', async () => {
    if (config !== undefined) {
      const pickItems = getPickerItems(config);
      const selectedItem = await vscode.window.showQuickPick<PickerCommandItem>(pickItems, {
        placeHolder: 'Select a command to run',
      });
      const selectedCommand = selectedItem?.commandoCommand;
      if (!selectedCommand) {
        return;
      }
      if (selectedCommand.kind === 'openWorkspaceConfig') {
        await vscode.commands.executeCommand('workbench.action.openWorkspaceSettingsFile');
        return;
      } else if (selectedCommand.kind === 'openUserConfig') {
        // open json file
        await vscode.commands.executeCommand('workbench.action.openSettingsJson');
        return;
      }
      if (!selectedCommand.cmd) {
        return;
      }
      runCommand(<ICommand>selectedCommand, config);
    } else {
      vscode.window.showErrorMessage(`Commando configuration is invalid.\n${configError?.message}`);
    }
  });

  context.subscriptions.push(disposable);
};

// This method is called when your extension is deactivated
export const deactivate = () => {
  console.log('Commando deactivated');
};

const getPickerItems = (config: IConfig): PickerCommandItem[] => {
  const pickItems: PickerCommandItem[] = config.commands.map((command) => ({
    label: command.name,
    description: command.description,
    commandoCommand: command,
  }));

  // Add special commands
  pickItems.push({
    label: 'Show workspace config',
    description: 'Show workspace config',
    commandoCommand: {
      name: 'Show workspace config',
      description: 'Show workspace config',
      cmd: '',
      kind: 'openWorkspaceConfig',
    },
  });
  pickItems.push({
    label: 'Show user config',
    description: 'Show user config',
    commandoCommand: {
      name: 'Show user config',
      description: 'Show user config',
      cmd: '',
      kind: 'openUserConfig',
    },
  });

  return pickItems;
};
