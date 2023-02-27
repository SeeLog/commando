import * as vscode from 'vscode';
import { platform } from 'os';
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
  if (getAutoClear(command, config)) {
    outputChannel.clear();
  }
  if (getAutoFocus(command, config)) {
    outputChannel.show(true);
  }

  const options = getExecOptions(command, config);

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
        outputChannel.appendLine(`Command exited with code ${code}`);
      }
      outputChannel.appendLine('Commando done.');
      resolve();
    });
  });
};

export const runCommandInTerminal = async (command: ICommand, config: IConfig): Promise<void> => {
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
  terminal.sendText(command.cmd);
  return;
};

/**
 * Get shell
 * @param command command interface
 * @param config config interface
 * @returns shell
 */
export const getShell = (command: ICommand, config: IConfig): string | undefined => {
  return command.shell ?? config.shell ?? defaultConfig.shell;
};

/**
 * Get window name
 * @param command command interface
 * @param config config interface
 * @returns window name
 */
export const getWindowName = (command: ICommand, config: IConfig): string => {
  const template = command.windowName ?? config.windowName ?? defaultConfig.windowName;
  return fmt(template, {
    [formatReplaceKeys.commandName]: command.name,
  });
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
  if (!shell && platform() === 'win32') {
    shell = 'powershell.exe';
  }
  const execOptions: ExecOptions = {
    shell: shell,
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
