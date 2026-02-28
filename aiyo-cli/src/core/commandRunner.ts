import { spawn } from 'child_process';
import * as vscode from 'vscode';
import { playError, playSuccess, playWarning } from '../services/soundManager';

export function runCommand(command: string, context: vscode.ExtensionContext) {

    const terminal = vscode.window.createTerminal("Aiyo Terminal");
    terminal.show();

    const process = spawn(command, { shell: true });

    let hasError = false;
    let hasWarning = false;

    process.stdout.on('data', (data) => {
        const output = data.toString();

        if (output.toLowerCase().includes('warning')) {
            hasWarning = true;
        }

        terminal.sendText(output);
    });

    process.stderr.on('data', (data) => {
        hasError = true;
        terminal.sendText(data.toString());
    });

    process.on('close', (code) => {
        if (hasError || code !== 0) {
            playError(context);
        } else if (hasWarning) {
            playWarning(context);
        } else {
            playSuccess(context);
        }
    });
}