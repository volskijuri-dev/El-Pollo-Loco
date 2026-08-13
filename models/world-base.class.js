class WorldBase {

    intervalIds = [];

    gameStarted = false;
    startScreenImage = new Image();
    gameOver = false;
    cameraX = 0;
    collectedCoins = 0;
    coinsTotal = 6;
    collectedBottles = 0;
    bottlesTotal = 4;
    canThrow = true;
    endboss = new Endboss();
    canEndbossHit = true;

    gameOverImage = new Image();
    youWinImage = new Image();

    gameWon = false;
    winSequenceStarted = false;

    IMAGES_HEALTH_BAR = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    IMAGES_COIN_BAR = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    IMAGES_BOTTLE_BAR = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    healthStatusBar = new StatusBar(
        this.IMAGES_HEALTH_BAR,
        20,
        10,
        100
    );

    coinStatusBar = new StatusBar(
        this.IMAGES_COIN_BAR,
        20,
        60,
        0
    );

    bottleStatusBar = new StatusBar(
        this.IMAGES_BOTTLE_BAR,
        20,
        110,
        0
    );

    character = new Character(
        'img/2_character_pepe/1_idle/idle/I-1.png',
        100,
        150
    );

    backgrounds = [

        // Himmel
        new BackgroundObject(
            'img/5_background/layers/air.png',
            0,
            0
        ),

        new BackgroundObject(
            'img/5_background/layers/air.png',
            720,
            0
        ),

        new BackgroundObject(
            'img/5_background/layers/air.png',
            1440,
            0
        ),

        new BackgroundObject(
            'img/5_background/layers/air.png',
            2160,
            0
        ),

        new BackgroundObject(
            'img/5_background/layers/air.png',
            2880,
            0
        ),

        // Berge hinten
        new BackgroundObject(
            'img/5_background/layers/3_third_layer/1.png',
            0,
            0
        ),

        new BackgroundObject(
            'img/5_background/layers/3_third_layer/2.png',
            720,
            0
        ),

        new BackgroundObject(
            'img/5_background/layers/3_third_layer/1.png',
            1440,
            0
        ),

        new BackgroundObject(
            'img/5_background/layers/3_third_layer/2.png',
            2160,
            0
        ),

        new BackgroundObject(
            'img/5_background/layers/3_third_layer/1.png',
            2880,
            0
        ),

        // Berge Mitte
        new BackgroundObject(
            'img/5_background/layers/2_second_layer/1.png',
            0,
            0
        ),

        new BackgroundObject(
            'img/5_background/layers/2_second_layer/2.png',
            720,
            0
        ),

        new BackgroundObject(
            'img/5_background/layers/2_second_layer/1.png',
            1440,
            0
        ),

        new BackgroundObject(
            'img/5_background/layers/2_second_layer/2.png',
            2160,
            0
        ),

        new BackgroundObject(
            'img/5_background/layers/2_second_layer/1.png',
            2880,
            0
        ),

        // Vordergrund
        new BackgroundObject(
            'img/5_background/layers/1_first_layer/1.png',
            0,
            0
        ),

        new BackgroundObject(
            'img/5_background/layers/1_first_layer/2.png',
            720,
            0
        ),

        new BackgroundObject(
            'img/5_background/layers/1_first_layer/1.png',
            1440,
            0
        ),

        new BackgroundObject(
            'img/5_background/layers/1_first_layer/2.png',
            2160,
            0
        ),

        new BackgroundObject(
            'img/5_background/layers/1_first_layer/1.png',
            2880,
            0
        )
    ];

    clouds = [
        new Cloud(
            'img/5_background/layers/4_clouds/1.png',
            100,
            20
        ),

        new Cloud(
            'img/5_background/layers/4_clouds/2.png',
            500,
            50
        ),

        new Cloud(
            'img/5_background/layers/4_clouds/1.png',
            900,
            30
        ),

        new Cloud(
            'img/5_background/layers/4_clouds/2.png',
            1300,
            60
        ),

        new Cloud(
            'img/5_background/layers/4_clouds/1.png',
            1750,
            15
        ),

        new Cloud(
            'img/5_background/layers/4_clouds/2.png',
            2200,
            45
        ),

        new Cloud(
            'img/5_background/layers/4_clouds/1.png',
            2650,
            25
        )
    ];

    chickens = [];
    smallChickens = [];

    coins = [
        new Coin(400, 280),
        new Coin(750, 220),
        new Coin(1100, 300),
        new Coin(1500, 240),
        new Coin(1900, 290),
        new Coin(2350, 210)
    ];

    bottles = [
        new Bottle(600, 340),
        new Bottle(1050, 340),
        new Bottle(1650, 340),
        new Bottle(2150, 340)
    ];

    throwableObjects = [];

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.setupScreenImages();
        this.createEnemies();
        this.setupDrawHandlers();
        this.run();
    }

    setupScreenImages() {
        this.gameOverImage.src =
            'img/9_intro_outro_screens/game_over/game over.png';
        this.youWinImage.src =
            'img/You won, you lost/You Win A.png';
        this.startScreenImage.src =
            'img/9_intro_outro_screens/start/startscreen_2.png';
    }

    createEnemies() {
        this.createChickens();
        this.createSmallChickens();
    }

    createChickens() {
        for (let i = 0; i < 5; i++) {
            this.chickens.push(
                this.createChicken(i)
            );
        }
    }

    createChicken(index) {
        return new Chicken(
            'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            500 + index * 300 + Math.random() * 200,
            360
        );
    }

    createSmallChickens() {
        for (let i = 0; i < 3; i++) {
            this.smallChickens.push(
                this.createSmallChicken(i)
            );
        }
    }

    createSmallChicken(index) {
        return new SmallChicken(
            'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            850 + index * 550,
            390
        );
    }

    setupDrawHandlers() {
        this.character.img.onload = () => this.draw();
        this.setupObjectDrawHandlers(this.backgrounds);
        this.setupObjectDrawHandlers(this.clouds);
    }

    setupObjectDrawHandlers(objects) {
        objects.forEach(object => {
            object.img.onload = () => {
                this.draw();
            };
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, 720, 480);

        if (!this.gameStarted) {
            this.drawStartScreen();
            return;
        }

        this.drawGameWorld();
        this.drawStatusBars();
        this.drawEndScreen();
    }

    drawStartScreen() {
        this.ctx.drawImage(
            this.startScreenImage,
            0, 0, 720, 480
        );
    }

    drawGameWorld() {
        this.ctx.save();
        this.ctx.translate(this.cameraX, 0);
        this.drawWorldObjects();
        this.ctx.restore();
    }

    drawWorldObjects() {
        this.addObjectsToMap(this.backgrounds);
        this.addObjectsToMap(this.clouds);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.bottles);
        this.addObjectsToMap(this.chickens);
        this.addObjectsToMap(this.smallChickens);
        this.addToMap(this.endboss);
        this.addToMap(this.character);
    }

    drawStatusBars() {
        this.addToMap(this.healthStatusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);
    }

    drawEndScreen() {
        if (this.gameOver) {
            this.drawGameOverScreen();
        }

        if (this.gameWon) {
            this.drawWinScreen();
        }
    }

    drawGameOverScreen() {
        this.ctx.drawImage(
            this.gameOverImage,
            0, 0, 720, 480
        );
    }

    drawWinScreen() {
        this.ctx.drawImage(
            this.youWinImage,
            0, 0, 720, 480
        );
    }
}