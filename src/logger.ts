import * as vscode from 'vscode';

export const outputChannelMap = new Map<string, vscode.OutputChannel>();

/**
 * Create or get output channel by name
 * If output channel already exists, return it.
 * Otherwise output channel does not exist, create it.
 *
 * @param name output channel name
 * @returns output channel
 */
export const getOutputChannel = (name: string): vscode.OutputChannel => {
  // Check if output channel already exists
  const outputChannel = outputChannelMap.get(name);
  if (outputChannel) {
    return outputChannel;
  }

  // Create new output channel
  const newOutputChannel = vscode.window.createOutputChannel(name);
  outputChannelMap.set(name, newOutputChannel);
  return newOutputChannel;
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
