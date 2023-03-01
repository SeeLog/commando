# Commando: Simple and powerful command executor extension for VSCode.
Commando is a powerful extension for VSCode that allows you to execute commands easily from the command palette or through keybindings.

![demo](https://user-images.githubusercontent.com/28619349/222213677-d948e57c-7c4b-4ad7-9d40-7a5964b02f05.gif)


## Features
- Execute any command from the command palette.
  - You can configure commands through the `settings.json` file.
    - Also you can configure through workspace's `settings.json` file.
- Execute any command from keybindings
  - You can set up keybindings in the `keybindings.json` file.
- Execute commands on save
  - You can configure commands to execute on save through the `settings.json` file.

### Execute commands from the command palette
For example if you want to execute the command `echo "Hello World"` from the command palette, you need to add the following configuration to `settings.json` file.
```json
  "commando.commands": [
    {
      "name": "Hello World",
      "description": "Prints Hello World to the console",
      "cmd": "echo \"Hello World\""
    },
  ]
```
If you want to automatically clear the output channel or terminal before each command, you can add the following configuration to `settings.json` file.
```json
  "commando.commands": [
    {
      "name": "Hello World",
      "description": "Prints Hello World to the console",
      "cmd": "echo \"Hello World\"",
      "autoClear": true
    },
  ]
```
For more information about the configuration, please see [Commands Settings](#Commands-Settings).

### Execute commands from keybindings
If you want to execute a command by pressing Ctrl+Shift+T, you need to add the following configuration to the `keybindings.json` file. Additionally, you need to add the command to the `settings.json` file as shown in the previous example.
```json
  {
    "key": "ctrl+shift+t",
    "command": "commando.execute",
    "args": {
      "name": "Hello World"
    }
  }
```
> Note: Please make sure that the command name is the same as the one you added to `settings.json` file.

### Execute commands on save
If you want to execute a command on save, you need to add the following configuration to the `settings.json` file.
```json
  "commando.commands": [
    {
      "name": "Hello World",
      "description": "Prints Hello World to the console",
      "cmd": "echo \"Hello World\"",
      "executeOnSavePattern": ".*\\.txt"
    },
  ]
```
> Note: You can use regex pattern for `executeOnSavePattern` setting.

## Extension Settings
### User Settings
This extension contributes the following settings:
- `commando.commands`: List of commands to execute. See [Commands Settings](#Commands-Settings).
- `commando.autoClear`: If true, automatically clear the output channel or terminal before each command.
- `commando.autoFocus`: If true, automatically focus the output channel or terminal before each command.
- `commando.executeInTerminal`: If true, execute commands in terminal. Otherwise, execute commands on background and show the result in output channel.
- `commando.windowName`: The name of the output channel or terminal. You can use [placeholders](#Placeholders).
- `commando.shell`: The shell to use for running commands. If empty, the default shell is used. This setting is only available when `commando.executeInTerminal` is false.

### Commands Settings
- `name`: The name of the command. This is used to identify the command. **This must be unique.**
- `description`: The description of the command. This is used to show the command in the command palette.
- `cmd`: The command to execute. You can use [placeholders](#Placeholders).
- `autoClear`: *(Optional)* If true, automatically clear the output channel or terminal before each command. If null, use the value of `commando.autoClear`.
- `autoFocus`: *(Optional)* If true, automatically focus the output channel or terminal before each command. If null, use the value of `commando.autoFocus`.
- `executeInTerminal`: *(Optional)* If true, execute commands in terminal. Otherwise, execute commands on background and show the result in output channel. If null, use the value of `commando.executeInTerminal`.
- `windowName`: *(Optional)* The name of the output channel or terminal. You can use [placeholders](#Placeholders). If null, use the value of `commando.windowName`.
- `shell`: *(Optional)* The shell to use for running commands. If empty, the default shell is used. This setting is only available when `commando.executeInTerminal` is false. If null, use the value of `commando.shell`.
- `executeOnSavePattern`: *(Optional)* The regex pattern of the file to execute the command on save. If null or empty string, the command is not executed on save.

### Placeholders
You can use placeholders in`cmd` and `windowsName` settings. The following placeholders are available:
- `${commandName}`: The command name. e.g. "Super Command"
- `${workspaceFolder}`: The workspace folder full path. e.g. "/home/ubuntu/hoge/.vscode/settings.json"
- `${workspaceFolderBasename}`: The workspace folder basename. e.g. "workspace"
- `${homeDir}`: Your home directory. e.g. "/home/ubuntu"
- `${tmpDir}`: The temporary directory. e.g. "/tmp/hogehoge/"
- `${platform}`: Your OS platform. e.g. "linux"
- `${file}`: The file full path. e.g. "/home/ubuntu/hoge/.vscode/settings.json"
- `${fileBasename}`: The file basename. e.g. "settings.json"
- `${fileExtname}`: The file extension. e.g. ".json"
- `${fileBasenameWithoutExt}`: The file basename without extension. e.g. "settings"
- `${fileDirName}`: The parent directory of the file. e.g. "/home/ubuntu/hoge/.vscode"
- `${relativeFile}`: The relative file path from `{workspaceFolder}`. e.g. ".vscode/settings.json"
- `${lineNumber}`: A line number of your selection. e.g. "5"
- `${lineNumbers}`: Line numbers of your selections. e.g. "5 5"
- `${columnNumber}`: A column number of your selection. e.g. "26"
- `${columnNumbers}`: Column numbers of your selection. e.g. "26 32"
- `${selectedText}`: Your selection text. e.g. "Hello"
- `${selectedTexts}`: Your selection texts. e.g. "Hello World"

## Known Issues
- Not yet. Please report if you find any issues.

## Release Notes
### 0.0.1
Initial release of Commando
