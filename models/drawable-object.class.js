class DrawableObject {
    x = 100;
    y = 150;
    height = 300;
    width = 150;

    img;
    imageCache = {};
    currentImage = 0;

    /**
     * Loads a single image from the specified path.
     * @param {string} path - The path to the image.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images and stores them in the image cache.
     * @param {string[]} paths - The paths of the images to load.
     */
    loadImages(paths) {
        paths.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Plays an animation continuously using the provided images.
     * @param {string[]} images - The image paths used for the animation.
     */
    playAnimation(images) {
        const imageIndex =
            this.currentImage % images.length;

        const path = images[imageIndex];
        const nextImage = this.imageCache[path];

        if (nextImage instanceof HTMLImageElement) {
            this.img = nextImage;
        }

        this.currentImage++;
    }

    /**
     * Plays an animation once and stops at the final image.
     * @param {string[]} images - The image paths used for the animation.
     */
    playAnimationOnce(images) {
        const lastImageIndex = images.length - 1;
        const nextImage = this.getAnimationImage(
            images,
            lastImageIndex
        );

        if (nextImage instanceof HTMLImageElement) {
            this.img = nextImage;
        }

        if (this.currentImage < lastImageIndex) {
            this.currentImage++;
        }
    }

    /**
     * Returns the current image of a non-repeating animation.
     * @param {string[]} images - The image paths used for the animation.
     * @param {number} lastImageIndex - The index of the final animation image.
     * @returns {HTMLImageElement} The cached animation image.
     */
    getAnimationImage(images, lastImageIndex) {
        const imageIndex = Math.min(
            this.currentImage,
            lastImageIndex
        );

        const path = images[imageIndex];
        return this.imageCache[path];
    }
}