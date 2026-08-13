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

        if (object.otherDirection) {
            this.flipImage(object);
        }

        this.ctx.drawImage(
            object.img,
            object.x,
            object.y,
            object.width,
            object.height
        );

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
                if (!this.gameStarted) {
                    this.draw();
                    return;
                }

                if (!this.character.isDead) {
                    this.handleCharacterMovement();
                }

                this.draw();
            }, 1000 / 60)
        );
    }

    startAnimationLoop() {
        this.intervalIds.push(
            setInterval(() => {
                if (!this.gameStarted) {
                    return;
                }

                this.handleCharacterAnimation();
            }, 120)
        );
    }

    startCollisionLoop() {
        this.intervalIds.push(
            setInterval(() => {
                if (!this.gameStarted) {
                    return;
                }

                this.checkCollisions();
                this.checkSmallChickenCollisions();
                this.checkCoinCollisions();
                this.checkBottleCollisions();
                this.checkEndbossActivation();
                this.checkEndbossAttack();
                this.checkEndbossCollision();
                this.checkBottleEndbossCollision();
                this.checkGameWon();
            }, 1000 / 60)
        );
    }

    handleCharacterMovement() {
        this.handleHorizontalMovement();
        this.handleJump();
        this.handleBottleThrow();
        this.updateCamera();
    }

    handleHorizontalMovement() {
        if (keyboard.RIGHT) {
            this.character.moveRight();
            this.character.resetIdleTimer();
        }

        if (
            keyboard.LEFT &&
            this.character.x > 20
        ) {
            this.character.moveLeft();
            this.character.resetIdleTimer();
        }
    }

    handleJump() {
        if (
            keyboard.UP &&
            !this.character.isAboveGround()
        ) {
            this.character.jump();
            this.character.resetIdleTimer();

            audioManager.play(audioManager.jumpSound);
        }
    }

    handleBottleThrow() {
        if (
            keyboard.SPACE &&
            this.collectedBottles > 0 &&
            this.canThrow
        ) {
            this.throwBottle();
            this.character.resetIdleTimer();
            this.canThrow = false;

            setTimeout(() => {
                this.canThrow = true;
            }, 500);
        }
    }

    updateCamera() {
        this.cameraX = Math.min(
            -this.character.x + 100,
            0
        );
    }

    handleCharacterAnimation() {
        if (this.character.isDead) {
            this.character.playAnimationOnce(
                this.character.IMAGES_DEAD
            );

        } else if (this.character.isHurt) {
            this.character.playAnimation(
                this.character.IMAGES_HURT
            );

        } else if (this.character.isAboveGround()) {
            this.character.playAnimation(
                this.character.IMAGES_JUMPING
            );

        } else if (keyboard.RIGHT || keyboard.LEFT) {
            this.character.playAnimation(
                this.character.IMAGES_WALKING
            );

        } else {
            const idleTime =
                new Date().getTime() -
                this.character.lastAction;

            if (idleTime >= 15000) {
                this.character.playAnimation(
                    this.character.IMAGES_LONG_IDLE
                );
                this.character.startSnoring();
            } else {
                this.character.stopSnoring();
                this.character.playAnimation(
                    this.character.IMAGES_IDLE
                );
            }
        }
    }

    stopGame() {
        this.intervalIds.forEach(intervalId => {
            clearInterval(intervalId);
        });

        this.intervalIds = [];
    }

    throwBottle() {
        this.throwableObjects.push(
            new ThrowableObject(
                this.character.x + 60,
                this.character.y + 100
            )
        );
        audioManager.play(audioManager.bottleSound);

        this.collectedBottles--;

        const bottlePercentage =
            this.calculatePercentage(
                this.collectedBottles,
                this.bottlesTotal
            );

        this.bottleStatusBar.setPercentage(
            bottlePercentage
        );
    }

    startGame() {
        this.gameStarted = true;

        audioManager.play(
            audioManager.backgroundMusic
        );

        this.chickens.forEach(chicken => {
            chicken.isActive = true;
        });

        this.smallChickens.forEach(chicken => {
            chicken.isActive = true;
        });

        this.draw();
    }

    checkCollisions() {
        this.chickens.forEach(chicken => {
            this.handleChickenCollision(chicken);
        });
    }

    handleChickenCollision(chicken) {
        if (
            chicken.isDead ||
            this.character.isDead
        ) {
            return;
        }

        if (!this.character.isColliding(chicken)) {
            return;
        }

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

        const isColliding =
            this.character.isColliding(chicken);

        if (!isColliding) {
            return;
        }

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
            const index =
                this.chickens.indexOf(chicken);

            if (index !== -1) {
                this.chickens.splice(index, 1);
            }
        }, 2000);
    }

    killSmallChicken(chicken) {
        chicken.die();
        this.character.speedY = 15;

        setTimeout(() => {
            const index =
                this.smallChickens.indexOf(chicken);

            if (index !== -1) {
                this.smallChickens.splice(index, 1);
            }
        }, 2000);
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