const player = require('play-sound')();

export function playError(context: any) {
    player.play(context.asAbsolutePath('src/sounds/error.mp3'));
    console.error('Error sound played');
}

export function playWarning(context: any) {
    player.play(context.asAbsolutePath('src/sounds/warning.mp3'));
}

export function playSuccess(context: any) {
    player.play(context.asAbsolutePath('src/sounds/success.mp3'));
}