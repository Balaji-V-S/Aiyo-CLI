import * as vscode from 'vscode';
import { runCommand } from './core/commandRunner';

export function activate(context: vscode.ExtensionContext) {

    const disposable = vscode.commands.registerCommand(
        'aiyo.runCommand',
        async () => {
            const command = await vscode.window.showInputBox({
                prompt: 'Enter CLI command to run'
            });
            
            if (command) {
                runCommand(command, context);
            }
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}