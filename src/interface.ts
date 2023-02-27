export interface ICommand {
  autoClear?: boolean;
  autoFocus?: boolean;
  name: string;
  description?: string;
  cmd: string;
  runOnTerminal?: boolean;
  windowName?: string;
  shell?: string;
}

export interface ISpecialCommand extends ICommand {
  kind?: 'openWorkspaceConfig' | 'openUserConfig';
}

export interface IConfig {
  autoClear: boolean;
  autoFocus: boolean;
  runOnTerminal?: boolean;
  windowName?: string;
  shell?: string;
  commands: ICommand[];
}

export interface IDefaultConfig {
  autoClear: boolean;
  autoFocus: boolean;
  runOnTerminal: boolean;
  windowName: string;
  shell?: string;
  commands: ICommand[];
}

export const formatReplaceKeys = {
  commandName: 'commandName',
} as const;
export type FormatReplaceKey = (typeof formatReplaceKeys)[keyof typeof formatReplaceKeys];

export const defaultConfig: IDefaultConfig = {
  autoClear: true,
  autoFocus: true,
  runOnTerminal: false,
  windowName: 'Commando ${commandName}',
  shell: undefined,
  commands: [],
};
