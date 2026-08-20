class World extends WorldPlay {

    /**
     * Adds multiple drawable objects to the canvas.
     * @param {DrawableObject[]} objects - The objects to add to the canvas.
     */
    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    /**
     * Adds a single drawable object to the canvas.
     * @param {DrawableObject} object - The object to draw.
     */
    addToMap(object) {
        if (!(object.img instanceof HTMLImageElement)) {
            return;
        }

        this.prepareImageDirection(object);
        this.drawObject(object);
        this.restoreImageDirection(object);
    }

    /**
     * Flips an object before drawing if it faces the opposite direction.
     * @param {DrawableObject} object - The object whose direction is prepared.
     */
    prepareImageDirection(object) {
        if (object.otherDirection) {
            this.flipImage(object);
        }
    }

    /**
     * Draws a single object on the canvas.
     * @param {DrawableObject} object - The object to draw.
     */
    drawObject(object) {
        this.ctx.drawImage(
            object.img,
            object.x,
            object.y,
            object.width,
            object.height
        );
    }

    /**
     * Restores the drawing direction after rendering a flipped object.
     * @param {DrawableObject} object - The object whose direction is restored.
     */
    restoreImageDirection(object) {
        if (object.otherDirection) {
            this.flipImageBack(object);
        }
    }

    /**
     * Mirrors an object horizontally before drawing.
     * @param {DrawableObject} object - The object to flip.
     */
    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x = object.x * -1;
    }

    /**
     * Restores an object after horizontal mirroring.
     * @param {DrawableObject} object - The flipped object to restore.
     */
    flipImageBack(object) {
        object.x = object.x * -1;
        this.ctx.restore();
    }

    /**
     * Checks collisions with normal chickens.
     */
    checkCollisions() {
        this.chickens.forEach(chicken => {
            this.handleChickenCollision(chicken);
        });
    }

    /**
     * Handles a collision between the character and a normal chicken.
     * @param {Chicken} chicken - The chicken involved in the collision.
     */
    handleChickenCollision(chicken) {
        if (chicken.isDead || this.character.isDead) {
            return;
        }

        if (!this.character.isColliding(chicken)) {
            return;
        }

        this.resolveChickenCollision(chicken);
    }

    /**
     * Resolves a collision with a normal chicken.
     * @param {Chicken} chicken - The chicken involved in the collision.
     */
    resolveChickenCollision(chicken) {
        if (this.isJumpingOnEnemy(chicken)) {
            this.killChicken(chicken);
        } else if (!this.character.isHurt) {
            this.handleCharacterHit();
        }
    }

    /**
     * Checks collisions with small chickens.
     */
    checkSmallChickenCollisions() {
        this.smallChickens.forEach(chicken => {
            this.handleSmallChickenCollision(chicken);
        });
    }

    /**
     * Handles a collision between the character and a small chicken.
     * @param {SmallChicken} chicken - The small chicken involved in the collision.
     */
    handleSmallChickenCollision(chicken) {
        if (chicken.isDead || this.character.isDead) {
            return;
        }

        if (!this.character.isColliding(chicken)) {
            return;
        }

        this.resolveSmallChickenCollision(chicken);
    }

    /**
     * Resolves a collision with a small chicken.
     * @param {SmallChicken} chicken - The small chicken involved in the collision.
     */
    resolveSmallChickenCollision(chicken) {
        if (this.isJumpingOnEnemy(chicken)) {
            this.killSmallChicken(chicken);
        } else {
            this.hitCharacterBySmallChicken();
        }
    }

    /**
     * Checks whether the character is jumping onto an enemy.
     * @param {MovableObject} enemy - The enemy to check.
     * @returns {boolean} True if the character is landing on the enemy.
     */
    isJumpingOnEnemy(enemy) {
        const characterBottom =
            this.character.y + this.character.height -
            this.character.offset.bottom;

        const enemyTop =
            enemy.y + enemy.offset.top;

        return (
            this.character.speedY < 0 &&
            characterBottom <= enemyTop + 30
        );
    }


    /**
     * Kills a normal chicken and bounces the character upward.
     * @param {Chicken} chicken - The chicken to kill.
     */
    killChicken(chicken) {
        chicken.die();
        this.character.speedY = 15;

        setTimeout(() => {
            this.removeChicken(chicken);
        }, 2000);
    }

    /**
     * Removes a normal chicken from the game world.
     * @param {Chicken} chicken - The chicken to remove.
     */
    removeChicken(chicken) {
        const index = this.chickens.indexOf(chicken);

        if (index !== -1) {
            this.chickens.splice(index, 1);
        }
    }

    /**
     * Kills a small chicken and bounces the character upward.
     * @param {SmallChicken} chicken - The small chicken to kill.
     */
    killSmallChicken(chicken) {
        chicken.die();
        this.character.speedY = 15;

        setTimeout(() => {
            this.removeSmallChicken(chicken);
        }, 2000);
    }

    /**
     * Removes a small chicken from the game world.
     * @param {SmallChicken} chicken - The small chicken to remove.
     */
    removeSmallChicken(chicken) {
        const index = this.smallChickens.indexOf(chicken);

        if (index !== -1) {
            this.smallChickens.splice(index, 1);
        }
    }

    /**
     * Applies damage from a small chicken if the character is not hurt.
     */
    hitCharacterBySmallChicken() {
        if (!this.character.isHurt) {
            this.handleCharacterHit();
        }
    }

    /**
     * Calculates a percentage value based on current and total amounts.
     * @param {number} currentAmount - The current collected amount.
     * @param {number} totalAmount - The total available amount.
     * @returns {number} The calculated percentage, limited to 100.
     */
    calculatePercentage(currentAmount, totalAmount) {
        return Math.min(
            currentAmount / totalAmount * 100,
            100
        );
    }
}