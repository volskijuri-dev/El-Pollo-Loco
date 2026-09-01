class WorldCheck extends WorldBase {

    /**
     * Checks whether the character collides with any coin.
     */
    checkCoinCollisions() {
        for (let index = this.coins.length - 1; index >= 0; index--) {
            const coin = this.coins[index];

            if (this.character.isColliding(coin)) {
                this.collectCoin(index);
            }
        }
    }

    /**
     * Collects a coin and updates the coin status bar.
     * @param {number} index - The index of the collected coin.
     */
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

    /**
     * Checks whether the character collides with any bottle.
     */
    checkBottleCollisions() {
        for (let index = this.bottles.length - 1; index >= 0; index--) {
            const bottle = this.bottles[index];

            if (this.character.isColliding(bottle)) {
                this.collectBottle(index);
            }
        }
    }

    /**
     * Collects a bottle and updates the bottle status bar.
     * @param {number} index - The index of the collected bottle.
     */
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

    /**
     * Checks whether the endboss should be activated.
     */
    checkEndbossActivation() {
        const distance =
            this.endboss.x - this.character.x;

        if (this.shouldActivateEndboss(distance)) {
            this.activateEndboss();
        }
    }

    /**
     * Checks whether the endboss should activate at the given distance.
     * @param {number} distance - The horizontal distance to the endboss.
     * @returns {boolean} True if the endboss should be activated.
     */
    shouldActivateEndboss(distance) {
        return (
            distance > 0 &&
            distance < 700 &&
            !this.endboss.isActive &&
            !this.gameOver
        );
    }

    /**
     * Activates the endboss and switches to boss music.
     */
    activateEndboss() {
        this.endboss.isActive = true;
        audioManager.backgroundMusic.pause();
        audioManager.backgroundMusic.currentTime = 0;
        audioManager.play(audioManager.bossSound);
        this.endboss.activateAlert();
    }

    /**
     * Updates the endboss attack state based on attack range.
     */
    checkEndbossAttack() {
        if (!this.endboss.isActive || this.isEndbossBusy()) {
            return;
        }

        this.endboss.state =
            this.isEndbossInAttackRange()
                ? 'ATTACK'
                : 'WALK';
    }

    /**
 * Checks whether the character is within the endboss attack range.
 * @returns {boolean} True if the character is within attack range.
 */
    isEndbossInAttackRange() {
        const bossLeft =
            this.endboss.x + this.endboss.offset.left;

        const characterRight =
            this.character.x +
            this.character.width -
            this.character.offset.right;

        return bossLeft - characterRight <= 25;
    }

    /**
     * Checks whether the endboss is currently in a busy state.
     * @returns {boolean} True if the endboss is hurt, dead, or alert.
     */
    isEndbossBusy() {
        return (
            this.endboss.state === 'HURT' ||
            this.endboss.state === 'DEAD' ||
            this.endboss.state === 'ALERT'
        );
    }

    /**
     * Checks whether the endboss collides with and can hit the character.
     */
    checkEndbossCollision() {
        if (!this.canEndbossAttackCharacter()) {
            return;
        }

        this.handleCharacterHit();
        this.startEndbossHitCooldown();
    }

    /**
     * Checks whether the endboss is allowed to attack the character.
     * @returns {boolean} True if the endboss can hit the character.
     */
    canEndbossAttackCharacter() {
        return (
            this.endboss.state === 'ATTACK' &&
            this.isEndbossInAttackRange() &&
            this.canEndbossHit &&
            !this.character.isDead
        );
    }

    /**
     * Starts the cooldown between endboss hits.
     */
    startEndbossHitCooldown() {
        this.canEndbossHit = false;

        setTimeout(() => {
            this.canEndbossHit = true;
        }, 700);
    }

    /**
     * Checks all throwable bottles for collisions with the endboss.
     */
    checkBottleEndbossCollision() {
        for (
            let index = this.throwableObjects.length - 1;
            index >= 0;
            index--
        ) {
            this.checkBottleHit(index);
        }
    }

    /**
     * Checks whether a throwable bottle hits the endboss.
     * @param {number} index - The index of the throwable bottle.
     */
    checkBottleHit(index) {
        const bottle = this.throwableObjects[index];

        if (this.canBottleHitEndboss(bottle)) {
            this.hitEndbossWithBottle(bottle);
        }
    }

    /**
     * Checks whether a bottle can damage the endboss.
     * @param {ThrowableObject} bottle - The bottle to check.
     * @returns {boolean} True if the bottle can hit the endboss.
     */
    canBottleHitEndboss(bottle) {
        return (
            this.endboss.isActive &&
            !bottle.isSplashing &&
            bottle.isColliding(this.endboss) &&
            this.endboss.energy > 0
        );
    }

    /**
     * Applies a bottle hit to the endboss.
     * @param {ThrowableObject} bottle - The bottle that hit the endboss.
     */
    hitEndbossWithBottle(bottle) {
        this.endboss.hit();

        this.endbossStatusBar.setPercentage(
            this.endboss.energy
        );

        bottle.splash();
    }

    /**
     * Checks whether the game has been won.
     */
    checkGameWon() {
        if (this.hasWonGame()) {
            this.startWinSequence();
        }
    }

    /**
     * Checks whether all conditions for winning the game are met.
     * @returns {boolean} True if the game has been won.
     */
    hasWonGame() {
        return (
            this.endboss.state === 'DEAD' &&
            !this.gameWon &&
            !this.winSequenceStarted
        );
    }

    /**
     * Starts the delayed win sequence.
     */
    startWinSequence() {
        this.winSequenceStarted = true;

        setTimeout(() => {
            this.finishGameWon();
        }, 2000);
    }

    /**
     * Finishes the win sequence and displays the restart button.
     */
    finishGameWon() {
        this.gameWon = true;
        this.character.stopSnoring();
        audioManager.bossSound.pause();
        audioManager.bossSound.currentTime = 0;
        audioManager.play(audioManager.winSound);
        this.showEndButtons();
    }

    /**
     * Handles the game-over state and stops active game sounds.
     */
    handleGameOver() {
        this.gameOver = true;
        this.character.stopSnoring();
        this.deactivateEnemies();
        this.stopGameMusic();
        this.playGameOverSound();
        this.showEndButtons();
    }

    /**
 * Deactivates all enemies after the game has ended.
 */
    deactivateEnemies() {
        this.chickens.forEach(chicken => {
            chicken.isActive = false;
        });

        this.smallChickens.forEach(chicken => {
            chicken.isActive = false;
        });

        this.endboss.isActive = false;
    }

    /**
     * Displays both end-screen buttons.
     */
    showEndButtons() {
        document
            .getElementById('restart-button')
            .classList.remove('hidden');

        document
            .getElementById('menu-button')
            .classList.remove('hidden');
    }


    /**
     * Applies damage to the character and updates the health bar.
     */
    handleCharacterHit() {
        this.character.hit();

        this.healthStatusBar.setPercentage(
            this.character.energy
        );

        if (this.character.energy === 0) {
            this.handleCharacterDeath();
        }
    }

    /**
     * Sets the character to the dead state and starts the game-over delay.
     */
    handleCharacterDeath() {
        this.character.die();

        setTimeout(() => {
            this.handleGameOver();
        }, 2000);
    }

    /**
     * Stops the background and boss music.
     */
    stopGameMusic() {
        audioManager.backgroundMusic.pause();
        audioManager.backgroundMusic.currentTime = 0;

        audioManager.bossSound.pause();
        audioManager.bossSound.currentTime = 0;
    }

    /**
     * Plays the game-over sound.
     */
    playGameOverSound() {
        audioManager.play(audioManager.gameoverSound);
    }
}