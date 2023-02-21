export interface ICommand {
  name: string;
  cmd: string;
  runOnTerminal?: boolean;
}

export interface IConfig {
  autoClear?: boolean;
  runOnTerminal?: boolean;
  commands: ICommand[];
}

export const defaultConfig: IConfig = {
  autoClear: true,
  runOnTerminal: false,
  commands: [],
};
