import * as vscode from 'vscode';

export const getOutputChannel = (name: string): vscode.OutputChannel => {
  return vscode.window.createOutputChannel(name, 'log');
};

export const getTerminal = (name: string): vscode.Terminal => {
  // Check if terminal already exists
  const terminal = vscode.window.terminals.find((terminal) => terminal.name === name);
  if (terminal) {
    return terminal;
  }
  // Create new terminal
  return vscode.window.createTerminal(name);
};
