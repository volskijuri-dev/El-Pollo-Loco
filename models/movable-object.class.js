class MovableObject extends DrawableObject {

    speed = 0.15;
    speedY = 0;
    acceleration = 2.5;

    /**
     * Applies gravity to the object by updating its vertical position.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Checks whether the object is above the ground.
     * @returns {boolean} True if the object is above the ground.
     */
    isAboveGround() {
        return this.y < 150;
    }

    /**
     * Makes the object jump by setting its vertical speed.
     */
    jump() {
        this.speedY = 30;
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Checks whether this object is colliding with another object.
     * @param {DrawableObject} otherObject - The object to check for collision.
     * @returns {boolean} True if both objects are colliding.
     */
    isColliding(otherObject) {
        return this.x + this.width > otherObject.x &&
               this.x < otherObject.x + otherObject.width &&
               this.y + this.height > otherObject.y &&
               this.y < otherObject.y + otherObject.height;
    }
}