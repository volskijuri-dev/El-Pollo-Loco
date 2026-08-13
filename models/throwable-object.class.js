class ThrowableObject extends MovableObject {

    moveInterval;

    /**
     * Creates a throwable bottle at the specified position.
     * @param {number} x - The initial horizontal position of the bottle.
     * @param {number} y - The initial vertical position of the bottle.
     */
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

    /**
     * Throws the bottle by applying vertical and horizontal movement.
     */
    throw() {
        this.speedY = 20;
        this.applyGravity();

        this.moveInterval = setInterval(() => {
            this.x += this.speedX;
        }, 1000 / 60);
    }

    /**
     * Stops the horizontal movement of the bottle.
     */
    stopMovement() {
        clearInterval(this.moveInterval);
    }
}