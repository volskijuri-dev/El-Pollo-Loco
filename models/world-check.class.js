class WorldCheck extends WorldBase {

    checkCoinCollisions() {
        for (let index = this.coins.length - 1; index >= 0; index--) {
            const coin = this.coins[index];

            if (this.character.isColliding(coin)) {
                this.collectCoin(index);
            }
        }
    }

    collectCoin(index) {
        this.coins.splice(index, 1);
        this.collectedCoins++;
        audioManager.play(audioManager.collectSound);

        const percentage = this.calculatePercentage(
            this.collectedCoins,
            this.coinsTotal
        );

        this.coinStatusBar.setPercentage(percentage);
    }

    checkBottleCollisions() {
        for (let index = this.bottles.length - 1; index >= 0; index--) {
            const bottle = this.bottles[index];

            if (this.character.isColliding(bottle)) {
                this.collectBottle(index);
            }
        }
    }

    collectBottle(index) {
        this.bottles.splice(index, 1);
        this.collectedBottles++;
        audioManager.play(audioManager.collectSound);

        const percentage = this.calculatePercentage(
            this.collectedBottles,
            this.bottlesTotal
        );

        this.bottleStatusBar.setPercentage(percentage);
    }

    checkEndbossActivation() {
        const distance =
            this.endboss.x - this.character.x;

        if (this.shouldActivateEndboss(distance)) {
            this.activateEndboss();
        }
    }

    shouldActivateEndboss(distance) {
        return (
            distance > 0 &&
            distance < 700 &&
            !this.endboss.isActive
        );
    }

    activateEndboss() {
        this.endboss.isActive = true;
        audioManager.backgroundMusic.pause();
        audioManager.backgroundMusic.currentTime = 0;
        audioManager.play(audioManager.bossSound);
        this.endboss.activateAlert();
    }

    checkEndbossAttack() {
        if (!this.endboss.isActive || this.isEndbossBusy()) {
            return;
        }

        const distance =
            this.endboss.x - this.character.x;

        this.endboss.state =
            distance < 180 ? 'ATTACK' : 'WALK';
    }

    isEndbossBusy() {
        return (
            this.endboss.state === 'HURT' ||
            this.endboss.state === 'DEAD' ||
            this.endboss.state === 'ALERT'
        );
    }

    checkEndbossCollision() {
        if (!this.canEndbossAttackCharacter()) {
            return;
        }

        this.handleCharacterHit();
        this.startEndbossHitCooldown();
    }

    canEndbossAttackCharacter() {
        return (
            this.endboss.state === 'ATTACK' &&
            this.character.isColliding(this.endboss) &&
            this.canEndbossHit &&
            !this.character.isDead
        );
    }

    startEndbossHitCooldown() {
        this.canEndbossHit = false;

        setTimeout(() => {
            this.canEndbossHit = true;
        }, 1000);
    }

    checkBottleEndbossCollision() {
        for (
            let index = this.throwableObjects.length - 1;
            index >= 0;
            index--
        ) {
            this.checkBottleHit(index);
        }
    }

    checkBottleHit(index) {
        const bottle = this.throwableObjects[index];

        if (this.canBottleHitEndboss(bottle)) {
            this.hitEndbossWithBottle(bottle, index);
        }
    }

    canBottleHitEndboss(bottle) {
        return (
            this.endboss.isActive &&
            bottle.isColliding(this.endboss) &&
            this.endboss.energy > 0
        );
    }

    hitEndbossWithBottle(bottle, index) {
        this.endboss.hit();
        bottle.stopMovement();
        this.throwableObjects.splice(index, 1);
    }

    checkGameWon() {
        if (this.hasWonGame()) {
            this.startWinSequence();
        }
    }

    hasWonGame() {
        return (
            this.endboss.state === 'DEAD' &&
            !this.gameWon &&
            !this.winSequenceStarted
        );
    }

    startWinSequence() {
        this.winSequenceStarted = true;

        setTimeout(() => {
            this.finishGameWon();
        }, 2000);
    }

    finishGameWon() {
        this.gameWon = true;
        audioManager.bossSound.pause();
        audioManager.bossSound.currentTime = 0;
        audioManager.play(audioManager.winSound);
        this.showRestartButton();
    }

    handleCharacterHit() {
        this.character.hit();

        this.healthStatusBar.setPercentage(
            this.character.energy
        );

        if (this.character.energy === 0) {
            this.handleCharacterDeath();
        }
    }

    handleCharacterDeath() {
        this.character.die();

        setTimeout(() => {
            this.handleGameOver();
        }, 2000);
    }

    handleGameOver() {
        this.gameOver = true;
        this.character.stopSnoring();
        this.stopGameMusic();
        this.playGameOverSound();
        this.showRestartButton();
    }

    stopGameMusic() {
        audioManager.backgroundMusic.pause();
        audioManager.backgroundMusic.currentTime = 0;

        audioManager.bossSound.pause();
        audioManager.bossSound.currentTime = 0;
    }

    playGameOverSound() {
        audioManager.play(audioManager.gameoverSound);
    }

    showRestartButton() {
        document
            .getElementById('restart-button')
            .classList.remove('hidden');
    }
}