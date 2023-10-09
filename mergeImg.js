import Jimp from "jimp"
async function mergeImages (firstImagePath, secondImagePath) {
return await Jimp.read(firstImagePath)
    .then(firstImage => {
      return Jimp.read(secondImagePath)
        .then(secondImage => {
          const centerX = (firstImage.getWidth() - secondImage.getWidth()) / 2;
          const centerY = (firstImage.getHeight() - secondImage.getHeight()) / 2;

          firstImage.composite(secondImage, centerX, centerY, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacityDest: 1,
            opacitySource: 1,
          });

          const outputImagePath = './mergeImg/image.png';

          return firstImage.writeAsync(outputImagePath);
        })
        .catch(err => {
          console.error('Error loading second image:', err);
        });
    })
    .catch(err => {
      console.error('Error loading first image:', err);
    });
}

export { mergeImages }
