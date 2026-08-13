class Cloud extends MovableObject {

    y = 20;
    width = 500;
    height = 250;
    speed = 0.15;

    constructor(path, x, y) {
        super();

        this.loadImage(path);

        this.x = x;
        this.y = y;

        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}