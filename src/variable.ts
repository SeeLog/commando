import * as vscode from 'vscode';
import * as path from 'path';
import { fmt } from './util';
import { ICommand, IConfig } from './interface';

export const formatReplaceKeys = {
  commandName: 'commandName',
  commandCmd: 'commandCmd',
  workspaceFolder: 'workspaceFolder',
  workspaceFolderBasename: 'workspaceFolderBasename',
  homeDir: 'homeDir',
  tmpDir: 'tmpDir',
  platform: 'platform',
  file: 'file',
  fileBasename: 'fileBasename',
  fileExtname: 'fileExtname',
  fileBasenameWithoutExt: 'fileBasenameWithoutExt',
  fileDirName: 'fileDirName',
  relativeFile: 'relativeFile',
  lineNumber: 'lineNumber',
  lineNumbers: 'lineNumbers',
  columnNumber: 'columnNumber',
  columnNumbers: 'columnNumbers',
  selectedText: 'selectedText',
  selectedTexts: 'selectedTexts',
} as const;
export type FormatReplaceKey = (typeof formatReplaceKeys)[keyof typeof formatReplaceKeys];

/**
 * Convert placeholder to actual value
 * @param text template string
 * @param command ICommand interface
 * @param config IConfig interface
 * @param document vscode.TextDocument
 * @returns converted string
 */
export const convertPlaceholder = (
  text: string,
  command: ICommand,
  config: IConfig,
  document: vscode.TextDocument | undefined = vscode.window.activeTextEditor?.document
): string => {
  const commandName = command.name;
  const commandCmd = command.cmd;

  let workspaceFolder = '';
  if (document) {
    workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri)?.uri.fsPath ?? '';
  }
  const workspaceFolderBasename = path.basename(workspaceFolder);
  const homeDir = process.env.HOME ?? process.env.USERPROFILE ?? '';
  const tmpDir = process.env.TMPDIR ?? '';

  const platform = process.platform;

  const filePath = document?.fileName ?? '';
  const fileBasename = path.basename(filePath);
  const fileExtname = path.extname(filePath);
  const fileBasenameWithoutExt = path.basename(filePath, fileExtname);
  const fileDirName = filePath.length > 0 ? path.dirname(filePath) : '';
  const relativeFilePath = path.relative(workspaceFolder, filePath);

  const lineNumber = vscode.window.activeTextEditor?.selection.active.line ?? '';
  const lineNumbers = vscode.window.activeTextEditor?.selections.map((selection) => selection.active.line) ?? [];
  const columnNumber = vscode.window.activeTextEditor?.selection.active.character ?? '';
  const columnNumbers = vscode.window.activeTextEditor?.selections.map((selection) => selection.active.character) ?? [];

  const selectedText =
    vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor?.selection) ?? '';
  const selectedTexts =
    vscode.window.activeTextEditor?.selections.map((selection) =>
      vscode.window.activeTextEditor?.document.getText(selection)
    ) ?? [];

  text = fmt(text, {
    [formatReplaceKeys.commandName]: commandName,
    [formatReplaceKeys.commandCmd]: commandCmd,
    [formatReplaceKeys.workspaceFolder]: workspaceFolder,
    [formatReplaceKeys.workspaceFolderBasename]: workspaceFolderBasename,
    [formatReplaceKeys.homeDir]: homeDir,
    [formatReplaceKeys.tmpDir]: tmpDir,
    [formatReplaceKeys.platform]: platform,
    [formatReplaceKeys.file]: filePath,
    [formatReplaceKeys.fileBasename]: fileBasename,
    [formatReplaceKeys.fileExtname]: fileExtname,
    [formatReplaceKeys.fileBasenameWithoutExt]: fileBasenameWithoutExt,
    [formatReplaceKeys.fileDirName]: fileDirName,
    [formatReplaceKeys.relativeFile]: relativeFilePath,
    [formatReplaceKeys.lineNumber]: lineNumber,
    [formatReplaceKeys.lineNumbers]: lineNumbers?.join(' '),
    [formatReplaceKeys.columnNumber]: columnNumber,
    [formatReplaceKeys.columnNumbers]: columnNumbers?.join(' '),
    [formatReplaceKeys.selectedText]: selectedText,
    [formatReplaceKeys.selectedTexts]: selectedTexts?.join(' '),
  });

  return text;
};
