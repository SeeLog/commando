export interface ICommand {
  autoClear?: boolean;
  autoFocus?: boolean;
  name: string;
  description?: string;
  cmd: string;
  executeInTerminal?: boolean;
  windowName?: string;
  shell?: string;
  executeOnSavePattern?: string;
  group?: string;
}

export interface ISpecialCommand extends ICommand {
  kind?: 'openWorkspaceConfig' | 'openUserConfig' | 'group' | 'separator';
}

export interface IConfig {
  autoClear: boolean;
  autoFocus: boolean;
  executeInTerminal?: boolean;
  windowName?: string;
  shell: string;
  commands: ICommand[];
  showInStatusBar?: boolean;
}

export interface IDefaultConfig {
  autoClear: boolean;
  autoFocus: boolean;
  executeInTerminal: boolean;
  windowName: string;
  shell: string;
  commands: ICommand[];
}

export const defaultConfig: IDefaultConfig = {
  autoClear: true,
  autoFocus: true,
  executeInTerminal: false,
  windowName: 'Commando ${commandName}',
  shell: '',
  commands: [],
};
