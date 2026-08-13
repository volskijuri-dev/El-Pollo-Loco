class BackgroundObject extends DrawableObject {
    constructor(path, x, y) {
        super();
        this.loadImage(path);

        this.x = x;
        this.y = y;
        this.width = 720;
        this.height = 480;
    }
}