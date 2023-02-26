import * as vscode from 'vscode';

export const getOutputChannel = (name: string): vscode.OutputChannel => {
  return vscode.window.createOutputChannel(name, { log: true });
};

export const getTerminal = (name: string): vscode.Terminal => {
  return vscode.window.createTerminal(name);
};
