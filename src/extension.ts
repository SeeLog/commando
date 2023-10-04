import * as vscode from 'vscode';
import { execute } from './command';
import { ICommand, IConfig, ISpecialCommand } from './interface';
import { getConfig, LoadConfigError } from './config';
import { localeMap } from './locale';
import { fmt } from './util';

export type PickerCommandItem = vscode.QuickPickItem & { commandoCommand: ICommand & ISpecialCommand };

const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
let groupMap: Record<string, PickerCommandItem[]> = {};
let pickerItems: PickerCommandItem[] = [];

export const activate = (context: vscode.ExtensionContext) => {
  let config: IConfig | undefined = undefined;
  let configError: LoadConfigError | undefined = undefined;
  try {
    config = getConfig();
    refreshPickerItems(config);
    refreshStatusBar();
  } catch (error) {
    if (error instanceof LoadConfigError) {
      configError = error;
    } else {
      throw error;
    }
  }

  vscode.workspace.onDidChangeConfiguration(() => {
    console.log('Commando configuration changed.');
    try {
      config = getConfig();
      refreshPickerItems(config);
      refreshStatusBar();
    } catch (error) {
      if (error instanceof LoadConfigError) {
        configError = error;
      } else {
        throw error;
      }
    }
  });

  vscode.workspace.onDidSaveTextDocument(async (document) => {
    const fileName = document.fileName;
    if (config === undefined || config === null) {
      return;
    }
    for (const command of config?.commands ?? []) {
      if (command.executeOnSavePattern) {
        const regex = new RegExp(command.executeOnSavePattern);
        if (regex.test(fileName)) {
          // execute commando on save
          await execute(command, config);
        }
      }
    }
  });

  const commandId = 'commando.execute';

  const disposable = vscode.commands.registerCommand(commandId, async (args) => {
    if (config !== undefined) {
      if (args !== undefined) {
        const name = args.name;
        if (name === undefined) {
          vscode.window.showErrorMessage(
            localeMap('commando.error.keybindingsConfiguration.invalidArgs.nameIsRequired')
          );
          return;
        }
        const command = config.commands.find((command) => command.name === name);
        if (command) {
          execute(command, config);
          return;
        } else {
          vscode.window.showErrorMessage(fmt(localeMap('commando.error.commandNotFound'), { commandName: name }));
          return;
        }
      }

      const selectedItem = await vscode.window.showQuickPick<PickerCommandItem>(pickerItems, {
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
      } else if (selectedCommand.kind === 'group') {
        // show group items
        const groupItems = getGroupItems(config, selectedCommand.name);
        const selectedItem = await vscode.window.showQuickPick<PickerCommandItem>(groupItems, {
          placeHolder: 'Select a command to run',
        });
        const groupSelectedCommand = selectedItem?.commandoCommand;
        if (!groupSelectedCommand) {
          return;
        }
        execute(<ICommand>groupSelectedCommand, config);
      }
      if (!selectedCommand.cmd) {
        return;
      }
      execute(<ICommand>selectedCommand, config);
    } else {
      vscode.window.showErrorMessage(localeMap('commando.error.configuration.invalid') + `\n${configError?.message}`);
    }
  });

  context.subscriptions.push(disposable);

  // status bar
  refreshStatusBar();
};

// This method is called when your extension is deactivated
export const deactivate = () => {
  console.log('Commando deactivated');
};

export const refreshStatusBar = () => {
  const config = getConfig();
  statusBarItem.command = 'commando.execute';
  statusBarItem.text = 'Commando';
  statusBarItem.tooltip = 'Commando: Execute command';
  if (config?.showInStatusBar) {
    console.log('Show Commando in status bar');
    statusBarItem.show();
  } else {
    console.log('Hide Commando in status bar');
    statusBarItem.hide();
  }
};

const getGroupItems = (config: IConfig, group: string): PickerCommandItem[] => {
  const groupItems = groupMap[group];
  if (!groupItems) {
    return [];
  }
  return groupItems;
};

const refreshPickerItems = (config: IConfig): PickerCommandItem[] => {
  groupMap = {};
  pickerItems = [];
  const notGroupItems: PickerCommandItem[] = [];
  for (const command of config.commands) {
    if (command.group) {
      if (!groupMap[command.group]) {
        groupMap[command.group] = [];
      }
      groupMap[command.group].push({
        label: command.name,
        description: command.description,
        commandoCommand: {
          kind: 'group',
          ...command,
        },
      });
    } else {
      notGroupItems.push({
        label: command.name,
        description: command.description,
        commandoCommand: command,
      });
    }
  }
  if (Object.keys(groupMap).length > 0) {
    pickerItems.push({
      kind: vscode.QuickPickItemKind.Separator,
      label: 'Group Commands',
      description: '',
      commandoCommand: {
        kind: 'separator',
        name: '',
        description: '',
        cmd: '',
      },
    });
  }
  // merge groupMap and notGroupItems to pickerItems
  for (const group in groupMap) {
    pickerItems.push({
      label: group,
      detail: groupMap[group].length + ' commands',
      description: 'Group Commands',
      commandoCommand: {
        kind: 'group',
        name: group,
        description: '',
        cmd: '',
      },
    });
  }
  pickerItems.push({
    kind: vscode.QuickPickItemKind.Separator,
    label: 'Commands',
    description: '',
    commandoCommand: {
      kind: 'separator',
      name: '',
      description: '',
      cmd: '',
    },
  });
  pickerItems.push(...notGroupItems);

  pickerItems.push({
    kind: vscode.QuickPickItemKind.Separator,
    label: 'Configurations',
    description: '',
    commandoCommand: {
      kind: 'separator',
      name: '',
      description: '',
      cmd: '',
    },
  });

  // Add special commands
  pickerItems.push({
    label: 'Show workspace config',
    description: 'Show workspace config',
    commandoCommand: {
      name: 'Show workspace config',
      description: 'Show workspace config',
      cmd: '',
      kind: 'openWorkspaceConfig',
    },
  });
  pickerItems.push({
    label: 'Show user config',
    description: 'Show user config',
    commandoCommand: {
      name: 'Show user config',
      description: 'Show user config',
      cmd: '',
      kind: 'openUserConfig',
    },
  });

  return pickerItems;
};
