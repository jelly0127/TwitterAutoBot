import axios from 'axios'
import fs from 'fs';
import { client1, client2, client3, client4, client5 } from './config.js'
import { mergeImages } from './mergeImg.js'


let count = 0

const imgApi = 'https://api.btstu.cn/sjbz/api.php?lx=fengjing&format=images&method=pc'
const imgInit = './srcImg/show.png'

// Timing loop posting time: once every 5 minutes
const interval = 1000 * 60 * 5;

// tweet content
const tweetStatus = ' #推特刷粉  ';

// img src
const imgPath = './mergeImg/image.png'

const filterNumber = (num) => {
  if (0 < num && num <= 50) {
    return client1;
  }
  if (50 < num && num <= 100) {
    return client2;
  }
  if (100 < num && num <= 150) {
    return client3;
  }
  if (150 < num && num <= 200) {
    return client4;
  }
  if (200 < num && num <= 250) {
    return client5;
  }
}


const getTitle = async () => {
  const { data: { hitokoto } } = await axios.get('https://v1.hitokoto.cn')
  return hitokoto
}

async function postTweetWithImage (status) {
  try {
    await mergeImages(imgApi, imgInit);
    const title = await getTitle()
    const mediaIds = await Promise.all([
      filterNumber(count).v1.uploadMedia(imgPath),
    ]);

    const newTweet = await filterNumber(count).v2.tweet({
      text: title + status,
      media: { media_ids: mediaIds }
    });
    count++
    console.log('Success:', newTweet.data.text);
    fs.unlink('./mergeImg/image.png', (err) => {
      if (err) throw err;
      console.log('File has been deleted!');
    });
    console.log('success count:',count);

  } catch (error) {
    console.error('Error:', error);
  }
}

// postTweetWithImage(tweetStatus);

// timed loop posting
setInterval(() => {
  postTweetWithImage(tweetStatus);
}, interval);

