class SmallChicken extends MovableObject {

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGE_DEAD =
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png';

    isDead = false;
    isActive = false;

    constructor(path, x, y) {
        super();

        this.loadImage(path);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages([this.IMAGE_DEAD]);

        this.x = x;
        this.y = y;

        this.width = 45;
        this.height = 45;

        this.speed = 0.5 + Math.random() * 0.7;

        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.isActive && !this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isActive && !this.isDead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 100);
    }

    die() {
        if (this.isDead) {
            return;
        }

        this.isDead = true;
        this.speed = 0;
        this.img = this.imageCache[this.IMAGE_DEAD];

        audioManager.play(audioManager.chickenhurtSound);
    }
}