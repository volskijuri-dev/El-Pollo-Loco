class DrawableObject {
    x = 100;
    y = 150;
    height = 300;
    width = 150;

    img;
    imageCache = {};
    currentImage = 0;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(paths) {
        paths.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

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

    getAnimationImage(images, lastImageIndex) {
        const imageIndex = Math.min(
            this.currentImage,
            lastImageIndex
        );

        const path = images[imageIndex];
        return this.imageCache[path];
    }
}