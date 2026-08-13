class Endboss extends MovableObject {

    height = 400;
    width = 250;
    x = 2500;
    y = 55;

    energy = 100;
    speed = 2;
    state = 'IDLE';
    isActive = false;

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    constructor() {
        super();

        this.loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.isActive) {
                return;
            }

            this.handleState();
        }, 150);
    }

    handleState() {
        if (this.state === 'ALERT') {
            this.playAnimation(this.IMAGES_ALERT);
        }

        if (this.state === 'WALK') {
            this.handleWalking();
        }

        if (this.state === 'ATTACK') {
            this.playAnimation(this.IMAGES_ATTACK);
        }

        this.handleFinalStates();
    }

    handleWalking() {
        this.moveLeft();
        this.playAnimation(this.IMAGES_WALKING);
    }

    handleFinalStates() {
        if (this.state === 'HURT') {
            this.playAnimation(this.IMAGES_HURT);
        }

        if (this.state === 'DEAD') {
            this.playAnimationOnce(this.IMAGES_DEAD);
        }
    }

    activateAlert() {
        if (this.state !== 'IDLE') {
            return;
        }

        this.state = 'ALERT';

        setTimeout(() => {
            this.state = 'WALK';
        }, 2000);
    }

    hit() {
        if (this.energy <= 0) {
            return;
        }

        this.energy -= 25;
        audioManager.play(audioManager.bosshurtSound);

        if (this.energy <= 0) {
            this.setDeadState();
            return;
        }

        this.setHurtState();
    }

    setDeadState() {
        this.energy = 0;
        this.currentImage = 0;
        this.state = 'DEAD';
    }

    setHurtState() {
        this.currentImage = 0;
        this.state = 'HURT';

        setTimeout(() => {
            this.resetAfterHurt();
        }, 600);
    }

    resetAfterHurt() {
        if (
            this.energy > 0 &&
            this.state === 'HURT'
        ) {
            this.currentImage = 0;
            this.state = 'WALK';
        }
    }
}