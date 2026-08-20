class Character extends MovableObject {
    speed = 5;
    otherDirection = false;
    currentImage = 0;
    energy = 100;
    lastHit = 0;
    isHurt = false;
    lastAction = new Date().getTime();
    isSnoring = false;

    offset = {
        top: 100,
        right: 30,
        bottom: 10,
        left: 30
    };

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    isDead = false;

    /**
     * Creates the character and loads all required animation images.
     * @param {string} path - The path to the initial character image.
     * @param {number} x - The initial horizontal position.
     * @param {number} y - The initial vertical position.
     */
    constructor(path, x, y) {
        super();
        this.loadImage(path);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.x = x;
        this.y = y;
        this.applyGravity();
    }

    isAboveGround() {
        return this.y < 130;
    }

    /**
     * Keeps the character on a fixed ground position.
     */
    setGroundPosition() {
        if (this.y > 130) {
            this.y = 130;
            this.speedY = 0;
        }
    }
    /**
     * Moves the character to the right and updates its direction.
     */
    moveRight() {
        super.moveRight();
        this.otherDirection = false;
    }

    /**
     * Moves the character to the left and updates its direction.
     */
    moveLeft() {
        super.moveLeft();
        this.otherDirection = true;
    }

    /**
     * Resets the idle timer and stops the snoring sound.
     */
    resetIdleTimer() {
        this.lastAction = new Date().getTime();
        this.stopSnoring();
    }

    /**
     * Sets the character to the dead state and stops its movement.
     */
    die() {
        this.isDead = true;
        this.speed = 0;
        this.speedY = 0;
        this.currentImage = 0;
    }

    /**
     * Handles a hit if the character is not currently protected
     * by the hit cooldown.
     */
    hit() {
        const currentTime = new Date().getTime();

        if (currentTime - this.lastHit <= 1000) {
            return;
        }

        this.takeDamage(currentTime);
        this.resetHurtState();
    }

    /**
     * Reduces the character's energy and activates the hurt state.
     * @param {number} currentTime - Timestamp of the current hit.
     */
    takeDamage(currentTime) {
        this.energy -= 20;
        this.lastHit = currentTime;
        this.isHurt = true;
        this.currentImage = 0;
        audioManager.play(audioManager.hurtSound);
        this.energy = Math.max(this.energy, 0);
    }

    /**
     * Resets the hurt state after a short delay.
     */
    resetHurtState() {
        setTimeout(() => {
            this.isHurt = false;
        }, 400);
    }

    /**
     * Starts the snoring sound if the character is not already snoring.
     */
    startSnoring() {
        if (this.isSnoring) {
            return;
        }

        this.isSnoring = true;
        audioManager.play(audioManager.snoreSound);
    }

    /**
     * Stops the snoring sound and resets its playback position.
     */
    stopSnoring() {
        if (!this.isSnoring) {
            return;
        }

        this.isSnoring = false;
        audioManager.snoreSound.pause();
        audioManager.snoreSound.currentTime = 0;
    }
}