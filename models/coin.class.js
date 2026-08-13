class Coin extends MovableObject {

    width = 60;
    height = 60;

    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor(x, y) {
        super();

        this.loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);

        this.x = x;
        this.y = y;

        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 250);
    }
}