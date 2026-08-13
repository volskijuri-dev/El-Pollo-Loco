let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();

/**
 * Initializes the canvas, game world, controls, and buttons.
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas);
    setupMobileControls();
    setupButtons();
    setupControlsInfo();
}

/**
 * Sets up the restart, start, and mute buttons.
 */
function setupButtons() {
    const restartButton = document.getElementById('restart-button');
    const startButton = document.getElementById('start-button');
    const muteButton = document.getElementById('mute-button');

    restartButton.addEventListener('click', restartGame);
    setupStartButton(startButton);
    setupMuteButton(muteButton);
}

/**
 * Sets up the start button.
 * @param {HTMLElement} button - The start button element.
 */
function setupStartButton(button) {
    button.addEventListener('click', () => {
        world.startGame();
        button.style.display = 'none';
    });
}

/**
 * Sets up the mute button and updates its displayed state.
 * @param {HTMLElement} button - The mute button element.
 */
function setupMuteButton(button) {
    updateMuteButton(button);

    button.addEventListener('click', () => {
        audioManager.toggleMute();
        updateMuteButton(button);
    });
}

/**
 * Sets up the controls information popup.
 */
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

/**
 * Sets up all mobile touch controls.
 */
function setupMobileControls() {
    bindTouchButton('btn-left', 'LEFT');
    bindTouchButton('btn-right', 'RIGHT');
    bindTouchButton('btn-jump', 'UP');
    bindTouchButton('btn-throw', 'SPACE');
}

/**
 * Connects a touch button with a keyboard control.
 * @param {string} buttonId - The ID of the touch button.
 * @param {string} key - The keyboard property controlled by the button.
 */
function bindTouchButton(buttonId, key) {
    const button = document.getElementById(buttonId);
    disableContextMenu(button);
    setupTouchStart(button, key);
    setupTouchEnd(button, key);
}

/**
 * Prevents the context menu from opening on a control button.
 * @param {HTMLElement} button - The button whose context menu is disabled.
 */
function disableContextMenu(button) {
    button.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });
}

/**
 * Sets up the touch-start event for a mobile control.
 * @param {HTMLElement} button - The mobile control button.
 * @param {string} key - The keyboard property activated by the button.
 */
function setupTouchStart(button, key) {
    button.addEventListener('touchstart', (event) => {
        event.preventDefault();
        keyboard[key] = true;
    });
}

/**
 * Sets up the touch-end and touch-cancel events for a mobile control.
 * @param {HTMLElement} button - The mobile control button.
 * @param {string} key - The keyboard property deactivated by the button.
 */
function setupTouchEnd(button, key) {
    button.addEventListener('touchend', (event) => {
        event.preventDefault();
        keyboard[key] = false;
    });

    button.addEventListener('touchcancel', () => {
        keyboard[key] = false;
    });
}

/**
 * Updates the mute button icon based on the current audio state.
 * @param {HTMLElement} button - The mute button element.
 */
function updateMuteButton(button) {
    if (audioManager.isMuted) {
        button.textContent = '🔇';
    } else {
        button.textContent = '🔊';
    }
}

/**
 * Restarts the game and creates a new game world.
 */
function restartGame() {
    stopCurrentGame();
    createNewGame();
    hideRestartButton();
    hideStartButton();
    world.startGame();
}

/**
 * Stops the current game and all active sounds.
 */
function stopCurrentGame() {
    world.stopGame();
    audioManager.stopAllSounds();
}

/**
 * Creates a new keyboard instance and game world.
 */
function createNewGame() {
    keyboard = new Keyboard();
    world = new World(canvas);
}

/**
 * Hides the restart button.
 */
function hideRestartButton() {
    document
        .getElementById('restart-button')
        .classList.add('hidden');
}

/**
 * Hides the start button.
 */
function hideStartButton() {
    document
        .getElementById('start-button')
        .style.display = 'none';
}

/**
 * Updates a keyboard state based on a keyboard event.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {boolean} isPressed - Whether the key is currently pressed.
 */
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