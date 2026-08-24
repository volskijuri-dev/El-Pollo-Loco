class ThrowableObject extends MovableObject {

    moveInterval;
    rotationInterval;
    gravityInterval;
    splashInterval;

    speedX = 10;
    groundY = 350;
    isSplashing = false;
    isFinished = false;

    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Creates a throwable bottle at the specified position.
     * @param {number} x - The initial horizontal position.
     * @param {number} y - The initial vertical position.
     */
    constructor(x, y) {
        super();
        this.loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 70;
        this.throw();
    }

    /**
     * Starts the bottle throw.
     */
    throw() {
        this.speedY = 20;
        this.startGravity();
        this.startHorizontalMovement();
        this.startRotation();
    }

    /**
     * Applies gravity until the bottle reaches the ground.
     */
    startGravity() {
        this.gravityInterval = setInterval(() => {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;

            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.splash();
            }
        }, 1000 / 25);
    }

    /**
     * Moves the bottle horizontally.
     */
    startHorizontalMovement() {
        this.moveInterval = setInterval(() => {
            this.x += this.speedX;
        }, 1000 / 60);
    }

    /**
     * Plays the bottle rotation while flying.
     */
    startRotation() {
        this.rotationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_ROTATION);
        }, 100);
    }

    /**
     * Starts the splash animation.
     */
    splash() {
        if (this.isSplashing) return;

        this.isSplashing = true;
        this.stopMovement();
        this.currentImage = 0;

        this.splashInterval = setInterval(() => {
            this.playAnimationOnce(this.IMAGES_SPLASH);
        }, 100);

        setTimeout(() => this.finishSplash(), 650);
    }

    /**
     * Finishes the splash animation.
     */
    finishSplash() {
        clearInterval(this.splashInterval);
        this.isFinished = true;
        this.img = null;
    }

    /**
     * Stops all bottle movement.
     */
    stopMovement() {
        clearInterval(this.moveInterval);
        clearInterval(this.rotationInterval);
        clearInterval(this.gravityInterval);
    }
}