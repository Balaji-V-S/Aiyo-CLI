import { spawn } from 'child_process';
import * as vscode from 'vscode';
import { playError, playSuccess, playWarning } from '../services/soundManager';

export function runCommand(command: string, context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('Aiyo CLI');
    outputChannel.show(true);
    outputChannel.appendLine(`> ${command}`);

    const process = spawn(command, { shell: true });
    let hasError = false;
    let hasWarning = false;

    process.stdout.on('data', (data: Buffer) => {
        const output = data.toString();
        outputChannel.append(output);

        if (output.toLowerCase().includes('warning')) {
            hasWarning = true;
        }
    });

    process.stderr.on('data', (data: Buffer) => {
        const output = data.toString();
        hasError = true;
        outputChannel.append(output);

        if (output.toLowerCase().includes('warning')) {
            hasWarning = true;
        }
    });

    process.on('close', (code: number | null) => {
        outputChannel.appendLine(`\nProcess exited with code ${code}`);

        if (hasError || code !== 0) {
            playError(context);
        } else if (hasWarning) {
            playWarning(context);
        } else {
            playSuccess(context);
        }
    });
}
