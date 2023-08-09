import Jimp  from "jimp"

const watermarkText = 'Your Watermark Text'; 
const imagePath = './srcImg/test.png'; 
const outputPath = 'res.png'; 
const main = async () => {
  Jimp.read(imagePath)
  .then(image => {
    return Jimp.loadFont(Jimp.FONT_SANS_32_WHITE) 
      .then(font => {
        const textWidth = Jimp.measureText(font, watermarkText);
        const textHeight = Jimp.measureTextHeight(font, watermarkText);
        const x = (image.bitmap.width - textWidth) / 2;
        const y = (image.bitmap.height - textHeight) / 2;

        image.print(font, x, y, watermarkText);
        return image;
      });
  })
  .then(imageWithWatermark => {
    return imageWithWatermark.quality(100).write(outputPath); 
  })
  .catch(err => {
    console.error('Error:', err);
  });

        
   
}

