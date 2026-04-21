import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

const player = require('play-sound')();

function getSoundPath(context: vscode.ExtensionContext, fileName: string) {
    return context.asAbsolutePath(path.join('src', 'sounds', fileName));
}

function playSound(context: vscode.ExtensionContext, fileName: string, label: string) {
    const soundPath = getSoundPath(context, fileName);
    if (!fs.existsSync(soundPath)) {
        vscode.window.setStatusBarMessage(`Aiyo: missing sound file ${fileName}`, 3000);
        return;
    }

    player.play(soundPath, (error: Error | null) => {
        if (error) {
            console.error(`Aiyo failed to play ${label} sound:`, error);
            vscode.window.setStatusBarMessage(`Aiyo: failed to play ${label} sound`, 3000);
        }
    });
}

export function playError(context: vscode.ExtensionContext) {
    playSound(context, 'error.mp3', 'error');
}

export function playWarning(context: vscode.ExtensionContext) {
    playSound(context, 'warning.mp3', 'warning');
}

export function playSuccess(context: vscode.ExtensionContext) {
    playSound(context, 'success.mp3', 'success');
}
