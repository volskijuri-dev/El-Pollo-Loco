class MovableObject extends DrawableObject {

    speed = 0.15;
    speedY = 0;
    acceleration = 2.5;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        return this.y < 150;
    }

    jump() {
        this.speedY = 30;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    isColliding(otherObject) {
        return this.x + this.width > otherObject.x &&
               this.x < otherObject.x + otherObject.width &&
               this.y + this.height > otherObject.y &&
               this.y < otherObject.y + otherObject.height;
    }
}