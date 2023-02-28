import * as vscode from 'vscode';
import { platform } from 'os';
import { ICommand, IConfig, defaultConfig } from './interface';
import { getOutputChannel, getTerminal } from './logger';
import { exec, ExecOptions } from 'child_process';
import { convertPlaceholder } from './variable';

/*
 * Run command in VSCode output channel or terminal
 * @param command interface
 * @param config interface
 */
export const execute = async (command: ICommand, config: IConfig): Promise<void> => {
  if (config.executeInTerminal || command.executeInTerminal) {
    return await executeInTerminal(command, config);
  }
  return await executeInOutputChannel(command, config);
};

export const executeInOutputChannel = async (command: ICommand, config: IConfig): Promise<void> => {
  const outputChannel = getOutputChannel(getWindowName(command, config));
  if (getAutoClear(command, config)) {
    outputChannel.clear();
  }
  if (getAutoFocus(command, config)) {
    outputChannel.show(true);
  }

  const options = getExecOptions(command, config);

  // exec command
  const commandText = getCommandText(command, config);
  const child = exec(commandText, options);
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
        outputChannel.appendLine(`Command exited with code ${code}`);
      }
      outputChannel.appendLine('Commando done.');
      resolve();
    });
  });
};

export const executeInTerminal = async (command: ICommand, config: IConfig): Promise<void> => {
  const terminal = getTerminal(getWindowName(command, config));
  if (getAutoFocus(command, config)) {
    terminal.show();
  }
  if (getAutoClear(command, config)) {
    // workbench.action.terminal.clear is not working well if autoFocus is false.
    // Because this command will clear the active terminal
    // whether it is the terminal we want to clear or not.
    // So we use terminal.sendText('clear') instead.
    terminal.sendText('clear');
  }
  const commandText = getCommandText(command, config);
  terminal.sendText(commandText);
  return;
};

/**
 * Convert exec input to string
 * @param command command interface
 * @param config config interface
 * @returns command text
 */
export const getCommandText = (command: ICommand, config: IConfig): string => {
  const template = command.cmd;
  return convertPlaceholder(template, command, config);
};

/**
 * Get shell
 * @param command command interface
 * @param config config interface
 * @returns shell
 */
export const getShell = (command: ICommand, config: IConfig): string => {
  return command.shell ?? config.shell;
};

/**
 * Get window name
 * @param command command interface
 * @param config config interface
 * @returns window name
 */
export const getWindowName = (command: ICommand, config: IConfig): string => {
  const template = command.windowName ?? config.windowName ?? defaultConfig.windowName;
  return convertPlaceholder(template, command, config);
};

/**
 * Get Auto focus option
 * @param command command interface
 * @param config config interface
 * @returns Auto focus option
 */
export const getAutoFocus = (command: ICommand, config: IConfig): boolean => {
  return command.autoFocus ?? config.autoFocus ?? defaultConfig.autoFocus;
};

/**
 * Get Auto clear option
 * @param command command interface
 * @param config config interface
 * @returns Auto clear option
 */
export const getAutoClear = (command: ICommand, config: IConfig): boolean => {
  return command.autoClear ?? config.autoClear ?? defaultConfig.autoClear;
};

/**
 * Get exec options
 * @param command command interface
 * @param config config interface
 * @returns exec options
 */
const getExecOptions = (command: ICommand, config: IConfig): ExecOptions => {
  const dir = getWorkingDir(vscode.window.activeTextEditor?.document.uri);
  let shell = getShell(command, config);
  if (shell !== '' && platform() === 'win32') {
    shell = 'powershell.exe';
  }
  const execOptions: ExecOptions = {
    shell: shell === '' ? undefined : shell,
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

/**
 * Convert exec output to unix style
 * @param output exec output
 * @returns unix style output
 */
const convertExecOutput = (output: string): string => {
  if (platform() === 'win32') {
    output = output.replace(/\r\n/g, '\n');
  }
  return output;
};
