import axios from 'axios';
import fs  from 'fs';
import path from 'path';



const __dirname = path.resolve();
// img api URL
const imageUrl = 'https://api.btstu.cn/sjbz/api.php?lx=fengjing&format=images&method=pc';
// download img
axios({
  method: 'get',
  url: imageUrl,
  responseType: 'stream'
})
  .then(response => {
    const imagePath = path.join(__dirname, 'downloaded_image.jpg'); //save img name
    const writer = fs.createWriteStream(imagePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  })
  .then(() => {
    console.log('img download success!');
  })
  .catch(error => {
    console.error('img download error', error);
  });