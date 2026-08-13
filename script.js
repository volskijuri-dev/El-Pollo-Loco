let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas);
    setupMobileControls();
    setupButtons();
    setupControlsInfo();
}

function setupButtons() {
    const restartButton =
        document.getElementById('restart-button');

    const startButton =
        document.getElementById('start-button');

    const muteButton =
        document.getElementById('mute-button');

    restartButton.addEventListener('click', restartGame);

    startButton.addEventListener('click', () => {
        world.startGame();
        startButton.style.display = 'none';
    });

    updateMuteButton(muteButton);

    muteButton.addEventListener('click', () => {
        audioManager.toggleMute();
        updateMuteButton(muteButton);
    });
}

function setupControlsInfo() {
    const controlsButton = document.getElementById('controls-button');
    const controlsInfo = document.getElementById('controls-info');
    const closeButton = document.getElementById('close-controls-button');

    controlsButton.addEventListener('click', () => {
        controlsInfo.classList.remove('hidden');
    });

    closeButton.addEventListener('click', () => {
        controlsInfo.classList.add('hidden');
    });
}

function setupMobileControls() {
    bindTouchButton('btn-left', 'LEFT');
    bindTouchButton('btn-right', 'RIGHT');
    bindTouchButton('btn-jump', 'UP');
    bindTouchButton('btn-throw', 'SPACE');
}

function bindTouchButton(buttonId, key) {
    const button = document.getElementById(buttonId);
    
    button.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

    button.addEventListener('touchstart', (event) => {
        event.preventDefault();
        keyboard[key] = true;
    });

    button.addEventListener('touchend', (event) => {
        event.preventDefault();
        keyboard[key] = false;
    });

    button.addEventListener('touchcancel', () => {
        keyboard[key] = false;
    });
}

function updateMuteButton(button) {
    if (audioManager.isMuted) {
        button.textContent = '🔇';
    } else {
        button.textContent = '🔊';
    }
}

function restartGame() {
    world.stopGame();
    audioManager.stopAllSounds();

    keyboard = new Keyboard();
    world = new World(canvas);

    document
        .getElementById('restart-button')
        .classList.add('hidden');

    document
        .getElementById('start-button')
        .style.display = 'none';

    world.startGame();
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        keyboard.RIGHT = true;
    }

    if (event.key === 'ArrowLeft') {
        keyboard.LEFT = true;
    }

    if (event.key === 'ArrowUp') {
        keyboard.UP = true;
    }

    if (event.key === 'ArrowDown') {
        keyboard.DOWN = true;
    }

    if (event.key === ' ') {
        keyboard.SPACE = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowRight') {
        keyboard.RIGHT = false;
    }

    if (event.key === 'ArrowLeft') {
        keyboard.LEFT = false;
    }

    if (event.key === 'ArrowUp') {
        keyboard.UP = false;
    }

    if (event.key === 'ArrowDown') {
        keyboard.DOWN = false;
    }

    if (event.key === ' ') {
        keyboard.SPACE = false;
    }
});