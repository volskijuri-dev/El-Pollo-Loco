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

        const nextImage =
            this.imageCache[path];

        if (nextImage instanceof HTMLImageElement) {
            this.img = nextImage;
        }

        this.currentImage++;
    }


    playAnimationOnce(images) {
        let lastImageIndex = images.length - 1;

        let imageIndex = Math.min(
            this.currentImage,
            lastImageIndex
        );

        let path = images[imageIndex];

        const nextImage = this.imageCache[path];

        if (nextImage instanceof HTMLImageElement) {
            this.img = nextImage;
        }

        if (this.currentImage < lastImageIndex) {
            this.currentImage++;
        }
    }
}
