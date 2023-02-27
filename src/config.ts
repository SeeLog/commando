import * as vscode from 'vscode';
import { IConfig, ICommand } from './interface';

export class LoadConfigError extends Error {}

export const getConfig = (): IConfig => {
  const config = vscode.workspace.getConfiguration('commando');
  const commandList = config.get<ICommand[]>('commands') ?? [];
  const alreadyUsedNameObj: Record<string, boolean> = {};

  commandList.forEach((command) => {
    if (!command.name || !command.cmd) {
      throw new LoadConfigError('Invalid commando command. Must have name and cmd.');
    }
    if (alreadyUsedNameObj[command.name]) {
      throw new LoadConfigError(`Duplicate commando command name: ${command.name}`);
    }
    alreadyUsedNameObj[command.name] = true;
  });

  return {
    autoClear: config.get<boolean>('autoClear') ?? true,
    autoFocus: config.get<boolean>('autoFocus') ?? true,
    runOnTerminal: config.get<boolean>('runOnTerminal') ?? false,
    windowName: config.get<string>('windowName') ?? 'Commando ${commandName}',
    shell: config.get<string>('shell'),
    commands: config.get<ICommand[]>('commands') ?? [],
  };
};
