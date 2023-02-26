export interface ICommand {
  autoClear?: boolean;
  autoFocus?: boolean;
  name: string;
  cmd: string;
  runOnTerminal?: boolean;
}

export interface IConfig {
  autoClear?: boolean;
  autoFocus?: boolean;
  runOnTerminal?: boolean;
  windowName?: string;
  commands: ICommand[];
}

export interface IDefaultConfig {
  autoClear: boolean;
  autoFocus: boolean;
  runOnTerminal: boolean;
  windowName: string;
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
  commands: [],
};
