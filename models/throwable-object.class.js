class ThrowableObject extends MovableObject {

    moveInterval;

    constructor(x, y) {
        super();

        this.loadImage(
            'img/6_salsa_bottle/salsa_bottle.png'
        );

        this.x = x;
        this.y = y;

        this.width = 60;
        this.height = 70;

        this.speedX = 10;

        this.throw();
    }

    throw() {
        this.speedY = 20;
        this.applyGravity();

        this.moveInterval = setInterval(() => {
            this.x += this.speedX;
        }, 1000 / 60);
    }

    stopMovement() {
        clearInterval(this.moveInterval);
    }
}