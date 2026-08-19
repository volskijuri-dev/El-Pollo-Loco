class WorldPlay extends WorldCheck {

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

        if (!this.character.isDead && !this.gameWon) {
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
        if (this.gameWon) return;

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
        this.character.resetIdleTimer();
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
}