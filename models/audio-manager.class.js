class AudioManager {
    isMuted = false;

    backgroundMusic = new Audio('audio/background.mp3');
    bossSound = new Audio('audio/boss.mp3');
    jumpSound = new Audio('audio/jump.mp3');
    collectSound = new Audio('audio/collect.mp3');
    hurtSound = new Audio('audio/hurt.mp3');
    chickenhurtSound = new Audio('audio/chickenhurt.mp3');
    bottleSound = new Audio('audio/bottle.mp3');
    bosshurtSound = new Audio('audio/bosshurt.mp3');
    winSound = new Audio('audio/win.mp3');
    gameoverSound = new Audio('audio/gameover.mp3');
    snoreSound = new Audio('audio/snore.mp3');

    /**
     * Creates the audio manager and restores the saved mute state.
     */
    constructor() {
        this.isMuted =
            localStorage.getItem('isMuted') === 'true';

        this.backgroundMusic.loop = true;
        this.bossSound.loop = true;
        this.snoreSound.loop = true;

        this.updateMuteState();
    }

    /**
     * Returns all sounds used by the game.
     * @returns {HTMLAudioElement[]} All game audio elements.
     */
    getAllSounds() {
        return [
            this.backgroundMusic, this.bossSound, this.jumpSound,
            this.collectSound, this.hurtSound, this.chickenhurtSound,
            this.bosshurtSound, this.bottleSound, this.winSound,
            this.gameoverSound, this.snoreSound
        ];
    }

    /**
     * Applies the current mute state to all game sounds.
     */
    updateMuteState() {
        const sounds = this.getAllSounds();

        sounds.forEach(sound => {
            sound.muted = this.isMuted;
        });
    }

    /**
     * Stops all game sounds and resets their playback position.
     */
    stopAllSounds() {
        const sounds = this.getAllSounds();

        sounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    /**
     * Toggles the mute state and stores it in local storage.
     */
    toggleMute() {
        this.isMuted = !this.isMuted;

        localStorage.setItem(
            'isMuted',
            this.isMuted
        );

        this.updateMuteState();

        if (!this.isMuted && world?.gameStarted) {
            this.resumeGameMusic();
        }
    }

    /**
     * Resumes the appropriate music for the current game state.
     */
    resumeGameMusic() {
        if (world.endboss.isActive) {
            this.bossSound.play();
        } else {
            this.backgroundMusic.play();
        }
    }

    /**
     * Plays a sound when audio is not muted.
     * @param {HTMLAudioElement} sound - The sound to play.
     */
    play(sound) {
        if (!this.isMuted) {
            sound.currentTime = 0;
            sound.play();
        }
    }
}