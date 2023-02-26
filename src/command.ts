import * as vscode from 'vscode';
import { platform } from 'os';
import * as iconv from 'iconv-lite';
import { ICommand, IConfig, formatReplaceKeys, FormatReplaceKey, defaultConfig } from './interface';
import { fmt } from './util';
import { getOutputChannel, getTerminal } from './logger';
import { exec, ExecOptions } from 'child_process';

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
  const options = getExecOptions(config);

  // exec command
  const child = exec(command.cmd, options);
  child.stdout?.on('data', (data) => {
    outputChannel.append(convertExecOutput(data));
  });
  child.stderr?.on('data', (data) => {
    outputChannel.append(convertExecOutput(data));
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

const getExecOptions = (config: IConfig): ExecOptions => {
  const dir = getWorkingDir(vscode.window.activeTextEditor?.document.uri);
  const shell = config.shell;
  if (!shell && platform() === 'win32') {
    config.shell = 'powershell.exe';
  }
  const execOptions: ExecOptions = {
    shell: config.shell,
    cwd: dir,
  };
  return execOptions;
};

/**
 * Get working directory.
 * If the file is in a workspace folder, use that folder.
 * Otherwise, use the first workspace folder.
 * @param uri file uri
 * @returns working directory
 */
const getWorkingDir = (uri: vscode.Uri | undefined): string | undefined => {
  if (!uri) {
    return undefined;
  }
  const fileWorkspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
  return fileWorkspaceFolder ? fileWorkspaceFolder.uri.fsPath : vscode.workspace.workspaceFolders?.[0].uri.fsPath;
};

const convertExecOutput = (output: string): string => {
  if (platform() === 'win32') {
    return output.replace(/\r\n/g, '\n');
  }
  return output;
};
