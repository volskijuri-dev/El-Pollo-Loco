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

    constructor() {
        this.isMuted =
            localStorage.getItem('isMuted') === 'true';

        this.backgroundMusic.loop = true;
        this.bossSound.loop = true;
        this.snoreSound.loop = true;

        this.updateMuteState();
    }

    updateMuteState() {
        const sounds = [
            this.backgroundMusic,
            this.bossSound,
            this.jumpSound,
            this.collectSound,
            this.hurtSound,
            this.chickenhurtSound,
            this.bosshurtSound,
            this.bottleSound,
            this.winSound,
            this.gameoverSound,
            this.snoreSound
        ];

        sounds.forEach(sound => {
            sound.muted = this.isMuted;
        });
    }

    stopAllSounds() {
        const sounds = [
            this.backgroundMusic,
            this.jumpSound,
            this.collectSound,
            this.hurtSound,
            this.bottleSound,
            this.bossSound,
            this.bosshurtSound,
            this.chickenhurtSound,
            this.winSound,
            this.gameoverSound,
            this.snoreSound
        ];

        sounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

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

    resumeGameMusic() {
        if (world.endboss.isActive) {
            this.bossSound.play();
        } else {
            this.backgroundMusic.play();
        }
    }

    play(sound) {
        if (!this.isMuted) {
            sound.currentTime = 0;
            sound.play();
        }
    }
}