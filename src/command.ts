import * as vscode from 'vscode';
import { ICommand, IConfig, formatReplaceKeys, FormatReplaceKey, defaultConfig } from './interface';
import { fmt } from './util';
import { getOutputChannel, getTerminal } from './logger';
import { exec } from 'child_process';

/*
 * Run command in VSCode output channel or terminal
 * @param command interface
 * @param config interface
 */
export const runCommand = async (command: ICommand, config: IConfig): Promise<void> => {
  if (config.runOnTerminal || command.runOnTerminal) {
    return await runCommandInTerminal(command, config);
  }
  return await runCommandInOutputChannel(command, config);
};

export const runCommandInOutputChannel = async (command: ICommand, config: IConfig): Promise<void> => {
  const outputChannel = getOutputChannel(getWindowName(command, config));
  if (command.autoFocus || (config.autoFocus && command.autoFocus !== false)) {
    outputChannel.show();
  }
  if (command.autoClear || (config.autoClear && command.autoClear !== false)) {
    outputChannel.clear();
  }

  // exec command
  const child = exec(command.cmd);
  child.stdout?.on('data', (data) => {
    outputChannel.append(data);
  });
  child.stderr?.on('data', (data) => {
    outputChannel.append(data);
  });
  child.on('error', (error) => {
    outputChannel.append(error.message);
  });

  // Wait for command to finish
  return new Promise((resolve) => {
    child.on('close', (code) => {
      if (code !== 0) {
        outputChannel.append(`Command exited with code ${code}`);
      }
      outputChannel.append('Commando done.');
      resolve();
    });
  });
};

export const runCommandInTerminal = async (command: ICommand, config: IConfig): Promise<void> => {
  // TODO: support terminal
  return;
};

export const getWindowName = (command: ICommand, config: IConfig): string => {
  return fmt(config.windowName ?? defaultConfig.windowName, {
    [formatReplaceKeys.commandName]: command.name,
  });
};
