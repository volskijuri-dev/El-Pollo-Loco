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
    const restartButton = document.getElementById('restart-button');
    const startButton = document.getElementById('start-button');
    const muteButton = document.getElementById('mute-button');

    restartButton.addEventListener('click', restartGame);
    setupStartButton(startButton);
    setupMuteButton(muteButton);
}

function setupStartButton(button) {
    button.addEventListener('click', () => {
        world.startGame();
        button.style.display = 'none';
    });
}

function setupMuteButton(button) {
    updateMuteButton(button);

    button.addEventListener('click', () => {
        audioManager.toggleMute();
        updateMuteButton(button);
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
    disableContextMenu(button);
    setupTouchStart(button, key);
    setupTouchEnd(button, key);
}

function disableContextMenu(button) {
    button.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });
}

function setupTouchStart(button, key) {
    button.addEventListener('touchstart', (event) => {
        event.preventDefault();
        keyboard[key] = true;
    });
}

function setupTouchEnd(button, key) {
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
    stopCurrentGame();
    createNewGame();
    hideRestartButton();
    hideStartButton();
    world.startGame();
}

function stopCurrentGame() {
    world.stopGame();
    audioManager.stopAllSounds();
}

function createNewGame() {
    keyboard = new Keyboard();
    world = new World(canvas);
}

function hideRestartButton() {
    document
        .getElementById('restart-button')
        .classList.add('hidden');
}

function hideStartButton() {
    document
        .getElementById('start-button')
        .style.display = 'none';
}

function setKeyboardKey(event, isPressed) {
    const keyMap = {
        ArrowRight: 'RIGHT',
        ArrowLeft: 'LEFT',
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ' ': 'SPACE'
    };

    const key = keyMap[event.key];

    if (key) {
        keyboard[key] = isPressed;
    }
}

window.addEventListener('keydown', (event) => {
    setKeyboardKey(event, true);
});

window.addEventListener('keyup', (event) => {
    setKeyboardKey(event, false);
});