class Cloud extends MovableObject {

    y = 20;
    width = 500;
    height = 250;
    speed = 0.15;

    /**
     * Creates a cloud at the specified position.
     * @param {string} path - The path to the cloud image.
     * @param {number} x - The initial horizontal position.
     * @param {number} y - The initial vertical position.
     */
    constructor(path, x, y) {
        super();

        this.loadImage(path);

        this.x = x;
        this.y = y;

        this.animate();
    }

    /**
     * Starts the continuous movement of the cloud to the left.
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}