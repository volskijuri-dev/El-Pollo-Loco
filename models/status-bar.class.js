class StatusBar extends DrawableObject {

    percentage = 0;
    images = [];

    /**
     * Creates a status bar with the specified images, position, and size.
     * @param {string[]} images - The image paths used for the status bar.
     * @param {number} x - The horizontal position of the status bar.
     * @param {number} y - The vertical position of the status bar.
     * @param {number} [startPercentage=0] - The initial percentage value.
     * @param {number} [width=200] - The width of the status bar.
     * @param {number} [height=50] - The height of the status bar.
     */
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

    /**
     * Updates the percentage and displays the corresponding image.
     * @param {number} percentage - The new percentage value.
     */
    setPercentage(percentage) {
        this.percentage = percentage;

        const path =
            this.images[this.resolveImageIndex()];

        this.img = this.imageCache[path];
    }

    /**
     * Determines the image index for the current percentage.
     * @returns {number} The index of the corresponding status bar image.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;

        return 0;
    }
}