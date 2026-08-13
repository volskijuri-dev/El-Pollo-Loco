class World extends WorldCheck {

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
     * Starts all main game loops.
     */
    run() {
        this.startGameLoop();
        this.startAnimationLoop();
        this.startCollisionLoop();
    }

    /**
     * Starts the main rendering and movement loop.
     */
    startGameLoop() {
        this.intervalIds.push(
            setInterval(() => {
                this.updateGameFrame();
            }, 1000 / 60)
        );
    }

    /**
     * Updates movement and renders the current game frame.
     */
    updateGameFrame() {
        if (!this.gameStarted) {
            this.draw();
            return;
        }

        if (!this.character.isDead) {
            this.handleCharacterMovement();
        }

        this.draw();
    }

    /**
     * Starts the character animation loop.
     */
    startAnimationLoop() {
        this.intervalIds.push(
            setInterval(() => {
                if (this.gameStarted) {
                    this.handleCharacterAnimation();
                }
            }, 120)
        );
    }

    /**
     * Starts the collision detection loop.
     */
    startCollisionLoop() {
        this.intervalIds.push(
            setInterval(() => {
                if (this.gameStarted) {
                    this.runCollisionChecks();
                }
            }, 1000 / 60)
        );
    }

    /**
     * Runs all collision and game-state checks.
     */
    runCollisionChecks() {
        this.checkCollisions();
        this.checkSmallChickenCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkEndbossActivation();
        this.checkEndbossAttack();
        this.checkEndbossCollision();
        this.checkBottleEndbossCollision();
        this.checkGameWon();
    }

    /**
     * Handles all character movement actions.
     */
    handleCharacterMovement() {
        this.handleHorizontalMovement();
        this.handleJump();
        this.handleBottleThrow();
        this.updateCamera();
    }

    /**
     * Handles horizontal keyboard movement.
     */
    handleHorizontalMovement() {
        if (keyboard.RIGHT) {
            this.moveCharacterRight();
        }

        if (keyboard.LEFT && this.character.x > 20) {
            this.moveCharacterLeft();
        }
    }

    /**
     * Moves the character to the right and resets the idle timer.
     */
    moveCharacterRight() {
        this.character.moveRight();
        this.character.resetIdleTimer();
    }

    /**
     * Moves the character to the left and resets the idle timer.
     */
    moveCharacterLeft() {
        this.character.moveLeft();
        this.character.resetIdleTimer();
    }

    /**
     * Handles character jumping.
     */
    handleJump() {
        if (keyboard.UP && !this.character.isAboveGround()) {
            this.character.jump();
            this.character.resetIdleTimer();
            audioManager.play(audioManager.jumpSound);
        }
    }

    /**
     * Handles throwing a bottle when allowed.
     */
    handleBottleThrow() {
        if (this.canThrowBottle()) {
            this.throwBottle();
            this.character.resetIdleTimer();
            this.startThrowCooldown();
        }
    }

    /**
     * Checks whether the character can throw a bottle.
     * @returns {boolean} True if a bottle can be thrown.
     */
    canThrowBottle() {
        return (
            keyboard.SPACE &&
            this.collectedBottles > 0 &&
            this.canThrow
        );
    }

    /**
     * Starts the cooldown before another bottle can be thrown.
     */
    startThrowCooldown() {
        this.canThrow = false;

        setTimeout(() => {
            this.canThrow = true;
        }, 500);
    }

    /**
     * Updates the camera position based on the character position.
     */
    updateCamera() {
        this.cameraX = Math.min(
            -this.character.x + 100,
            0
        );
    }

    /**
     * Selects and plays the correct character animation.
     */
    handleCharacterAnimation() {
        if (this.character.isDead) {
            this.playDeadAnimation();
        } else if (this.character.isHurt) {
            this.playHurtAnimation();
        } else if (this.character.isAboveGround()) {
            this.playJumpAnimation();
        } else {
            this.handleGroundAnimation();
        }
    }

    /**
     * Plays the character death animation once.
     */
    playDeadAnimation() {
        this.character.playAnimationOnce(
            this.character.IMAGES_DEAD
        );
    }

    /**
     * Plays the character hurt animation.
     */
    playHurtAnimation() {
        this.character.playAnimation(
            this.character.IMAGES_HURT
        );
    }

    /**
     * Plays the character jumping animation.
     */
    playJumpAnimation() {
        this.character.playAnimation(
            this.character.IMAGES_JUMPING
        );
    }

    /**
     * Handles walking or idle animation while on the ground.
     */
    handleGroundAnimation() {
        if (keyboard.RIGHT || keyboard.LEFT) {
            this.character.playAnimation(
                this.character.IMAGES_WALKING
            );
        } else {
            this.handleIdleAnimation();
        }
    }

    /**
     * Selects the normal or long idle animation.
     */
    handleIdleAnimation() {
        const idleTime =
            new Date().getTime() - this.character.lastAction;

        if (idleTime >= 15000) {
            this.playLongIdleAnimation();
        } else {
            this.playIdleAnimation();
        }
    }

    /**
     * Plays the long idle animation and starts snoring.
     */
    playLongIdleAnimation() {
        this.character.playAnimation(
            this.character.IMAGES_LONG_IDLE
        );
        this.character.startSnoring();
    }

    /**
     * Plays the normal idle animation and stops snoring.
     */
    playIdleAnimation() {
        this.character.stopSnoring();
        this.character.playAnimation(
            this.character.IMAGES_IDLE
        );
    }

    /**
     * Stops all active game intervals.
     */
    stopGame() {
        this.intervalIds.forEach(intervalId => {
            clearInterval(intervalId);
        });

        this.intervalIds = [];
    }

    /**
     * Throws a bottle and updates the bottle inventory.
     */
    throwBottle() {
        this.createThrowableBottle();
        audioManager.play(audioManager.bottleSound);
        this.collectedBottles--;
        this.updateBottleStatusBar();
    }

    /**
     * Creates a throwable bottle at the character position.
     */
    createThrowableBottle() {
        this.throwableObjects.push(
            new ThrowableObject(
                this.character.x + 60,
                this.character.y + 100
            )
        );
    }

    /**
     * Updates the bottle status bar.
     */
    updateBottleStatusBar() {
        const percentage = this.calculatePercentage(
            this.collectedBottles,
            this.bottlesTotal
        );

        this.bottleStatusBar.setPercentage(percentage);
    }

    /**
     * Starts the game and activates all enemies.
     */
    startGame() {
        this.gameStarted = true;
        audioManager.play(audioManager.backgroundMusic);
        this.activateEnemies(this.chickens);
        this.activateEnemies(this.smallChickens);
        this.draw();
    }

    /**
     * Activates all provided enemies.
     * @param {Array} enemies - The enemies to activate.
     */
    activateEnemies(enemies) {
        enemies.forEach(enemy => {
            enemy.isActive = true;
        });
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
            this.character.y + this.character.height;

        return (
            this.character.speedY < 0 &&
            characterBottom <= enemy.y + 30
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