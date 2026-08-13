class World extends WorldCheck {

    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    addToMap(object) {
        if (!(object.img instanceof HTMLImageElement)) {
            return;
        }

        this.prepareImageDirection(object);
        this.drawObject(object);
        this.restoreImageDirection(object);
    }

    prepareImageDirection(object) {
        if (object.otherDirection) {
            this.flipImage(object);
        }
    }

    drawObject(object) {
        this.ctx.drawImage(
            object.img,
            object.x,
            object.y,
            object.width,
            object.height
        );
    }

    restoreImageDirection(object) {
        if (object.otherDirection) {
            this.flipImageBack(object);
        }
    }

    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x = object.x * -1;
    }

    flipImageBack(object) {
        object.x = object.x * -1;
        this.ctx.restore();
    }

    run() {
        this.startGameLoop();
        this.startAnimationLoop();
        this.startCollisionLoop();
    }

    startGameLoop() {
        this.intervalIds.push(
            setInterval(() => {
                this.updateGameFrame();
            }, 1000 / 60)
        );
    }

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

    startAnimationLoop() {
        this.intervalIds.push(
            setInterval(() => {
                if (this.gameStarted) {
                    this.handleCharacterAnimation();
                }
            }, 120)
        );
    }

    startCollisionLoop() {
        this.intervalIds.push(
            setInterval(() => {
                if (this.gameStarted) {
                    this.runCollisionChecks();
                }
            }, 1000 / 60)
        );
    }

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

    handleCharacterMovement() {
        this.handleHorizontalMovement();
        this.handleJump();
        this.handleBottleThrow();
        this.updateCamera();
    }

    handleHorizontalMovement() {
        if (keyboard.RIGHT) {
            this.moveCharacterRight();
        }

        if (keyboard.LEFT && this.character.x > 20) {
            this.moveCharacterLeft();
        }
    }

    moveCharacterRight() {
        this.character.moveRight();
        this.character.resetIdleTimer();
    }

    moveCharacterLeft() {
        this.character.moveLeft();
        this.character.resetIdleTimer();
    }

    handleJump() {
        if (keyboard.UP && !this.character.isAboveGround()) {
            this.character.jump();
            this.character.resetIdleTimer();
            audioManager.play(audioManager.jumpSound);
        }
    }

    handleBottleThrow() {
        if (this.canThrowBottle()) {
            this.throwBottle();
            this.character.resetIdleTimer();
            this.startThrowCooldown();
        }
    }

    canThrowBottle() {
        return (
            keyboard.SPACE &&
            this.collectedBottles > 0 &&
            this.canThrow
        );
    }

    startThrowCooldown() {
        this.canThrow = false;

        setTimeout(() => {
            this.canThrow = true;
        }, 500);
    }

    updateCamera() {
        this.cameraX = Math.min(
            -this.character.x + 100,
            0
        );
    }

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

    playDeadAnimation() {
        this.character.playAnimationOnce(
            this.character.IMAGES_DEAD
        );
    }

    playHurtAnimation() {
        this.character.playAnimation(
            this.character.IMAGES_HURT
        );
    }

    playJumpAnimation() {
        this.character.playAnimation(
            this.character.IMAGES_JUMPING
        );
    }

    handleGroundAnimation() {
        if (keyboard.RIGHT || keyboard.LEFT) {
            this.character.playAnimation(
                this.character.IMAGES_WALKING
            );
        } else {
            this.handleIdleAnimation();
        }
    }

    handleIdleAnimation() {
        const idleTime =
            new Date().getTime() - this.character.lastAction;

        if (idleTime >= 15000) {
            this.playLongIdleAnimation();
        } else {
            this.playIdleAnimation();
        }
    }

    playLongIdleAnimation() {
        this.character.playAnimation(
            this.character.IMAGES_LONG_IDLE
        );
        this.character.startSnoring();
    }

    playIdleAnimation() {
        this.character.stopSnoring();
        this.character.playAnimation(
            this.character.IMAGES_IDLE
        );
    }

    stopGame() {
        this.intervalIds.forEach(intervalId => {
            clearInterval(intervalId);
        });

        this.intervalIds = [];
    }

    throwBottle() {
        this.createThrowableBottle();
        audioManager.play(audioManager.bottleSound);
        this.collectedBottles--;
        this.updateBottleStatusBar();
    }

    createThrowableBottle() {
        this.throwableObjects.push(
            new ThrowableObject(
                this.character.x + 60,
                this.character.y + 100
            )
        );
    }

    updateBottleStatusBar() {
        const percentage = this.calculatePercentage(
            this.collectedBottles,
            this.bottlesTotal
        );

        this.bottleStatusBar.setPercentage(percentage);
    }

    startGame() {
        this.gameStarted = true;
        audioManager.play(audioManager.backgroundMusic);
        this.activateEnemies(this.chickens);
        this.activateEnemies(this.smallChickens);
        this.draw();
    }

    activateEnemies(enemies) {
        enemies.forEach(enemy => {
            enemy.isActive = true;
        });
    }

    checkCollisions() {
        this.chickens.forEach(chicken => {
            this.handleChickenCollision(chicken);
        });
    }

    handleChickenCollision(chicken) {
        if (chicken.isDead || this.character.isDead) {
            return;
        }

        if (!this.character.isColliding(chicken)) {
            return;
        }

        this.resolveChickenCollision(chicken);
    }

    resolveChickenCollision(chicken) {
        if (this.isJumpingOnEnemy(chicken)) {
            this.killChicken(chicken);
        } else if (!this.character.isHurt) {
            this.handleCharacterHit();
        }
    }

    checkSmallChickenCollisions() {
        this.smallChickens.forEach(chicken => {
            this.handleSmallChickenCollision(chicken);
        });
    }

    handleSmallChickenCollision(chicken) {
        if (chicken.isDead || this.character.isDead) {
            return;
        }

        if (!this.character.isColliding(chicken)) {
            return;
        }

        this.resolveSmallChickenCollision(chicken);
    }

    resolveSmallChickenCollision(chicken) {
        if (this.isJumpingOnEnemy(chicken)) {
            this.killSmallChicken(chicken);
        } else {
            this.hitCharacterBySmallChicken();
        }
    }

    isJumpingOnEnemy(enemy) {
        const characterBottom =
            this.character.y + this.character.height;

        return (
            this.character.speedY < 0 &&
            characterBottom <= enemy.y + 30
        );
    }

    killChicken(chicken) {
        chicken.die();
        this.character.speedY = 15;

        setTimeout(() => {
            this.removeChicken(chicken);
        }, 2000);
    }

    removeChicken(chicken) {
        const index = this.chickens.indexOf(chicken);

        if (index !== -1) {
            this.chickens.splice(index, 1);
        }
    }

    killSmallChicken(chicken) {
        chicken.die();
        this.character.speedY = 15;

        setTimeout(() => {
            this.removeSmallChicken(chicken);
        }, 2000);
    }

    removeSmallChicken(chicken) {
        const index = this.smallChickens.indexOf(chicken);

        if (index !== -1) {
            this.smallChickens.splice(index, 1);
        }
    }

    hitCharacterBySmallChicken() {
        if (!this.character.isHurt) {
            this.handleCharacterHit();
        }
    }

    calculatePercentage(currentAmount, totalAmount) {
        return Math.min(
            currentAmount / totalAmount * 100,
            100
        );
    }
}