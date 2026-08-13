class StatusBar extends DrawableObject {

    percentage = 0;
    images = [];

    constructor(
        images,
        x,
        y,
        startPercentage = 0,
        width = 200,
        height = 50
    ) {
        super();

        this.images = images;
        this.loadImages(this.images);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.setPercentage(startPercentage);
    }

    setPercentage(percentage) {
        this.percentage = percentage;

        const path =
            this.images[this.resolveImageIndex()];

        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;

        return 0;
    }
}