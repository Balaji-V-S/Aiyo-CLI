import * as vscode from 'vscode';
import { runCommand } from './core/commandRunner';
import { playError, playSuccess, playWarning } from './services/soundManager';

export function activate(context: vscode.ExtensionContext) {
    const runCommandDisposable = vscode.commands.registerCommand('aiyo-cli.runCommand', async () => {
        const command = await vscode.window.showInputBox({
            prompt: 'Enter CLI command to run'
        });

        if (command) {
            runCommand(command, context);
        }
    });

    const playSuccessDisposable = vscode.commands.registerCommand('aiyo-cli.playSuccessSound', () => {
        playSuccess(context);
    });

    const playWarningDisposable = vscode.commands.registerCommand('aiyo-cli.playWarningSound', () => {
        playWarning(context);
    });

    const playErrorDisposable = vscode.commands.registerCommand('aiyo-cli.playErrorSound', () => {
        playError(context);
    });

    const diagnosticsDisposable = vscode.languages.onDidChangeDiagnostics(() => {
        const activeDoc = vscode.window.activeTextEditor?.document;
        if (activeDoc) {
            checkDiagnostics(activeDoc, context);
        }
    });

    const saveDisposable = vscode.workspace.onDidSaveTextDocument((document) => {
        checkDiagnostics(document, context);
    });

    context.subscriptions.push(
        runCommandDisposable,
        playSuccessDisposable,
        playWarningDisposable,
        playErrorDisposable,
        diagnosticsDisposable,
        saveDisposable
    );
}

function checkDiagnostics(document: vscode.TextDocument, context: vscode.ExtensionContext) {
    const diagnostics = vscode.languages.getDiagnostics(document.uri);
    const hasError = diagnostics.some(d => d.severity === vscode.DiagnosticSeverity.Error);
    const hasWarning = diagnostics.some(d => d.severity === vscode.DiagnosticSeverity.Warning);

    if (hasError) {
        playError(context);
    } else if (hasWarning) {
        playWarning(context);
    }
}

export function deactivate() {}
