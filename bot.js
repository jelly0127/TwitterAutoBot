import axios from 'axios'
import fs from 'fs';
import { mergeImages } from './mergeImg.js'
import { TwitterApi } from 'twitter-api-v2';
import { config } from "dotenv";
import { HttpsProxyAgent } from 'https-proxy-agent';

config();

const proxy = process.env.HTTP_PROXY
const httpAgent = new HttpsProxyAgent(proxy);
const client1 = new TwitterApi({
  appKey: process.env.CONSUMER_KEY_1,
  appSecret: process.env.CONSUMER_SECRET_1,
  accessToken: process.env.ACCESS_TOKEN_1,
  accessSecret: process.env.ACCESS_TOKEN_SECRET_1,
}, { httpAgent })

const client2 = new TwitterApi({
  appKey: process.env.CONSUMER_KEY_2,
  appSecret: process.env.CONSUMER_SECRET_2,
  accessToken: process.env.ACCESS_TOKEN_2,
  accessSecret: process.env.ACCESS_TOKEN_SECRET_2,
}, { httpAgent })

const client3 = new TwitterApi({
  appKey: process.env.CONSUMER_KEY_3,
  appSecret: process.env.CONSUMER_SECRET_3,
  accessToken: process.env.ACCESS_TOKEN_3,
  accessSecret: process.env.ACCESS_TOKEN_SECRET_3,
}, { httpAgent })

const client4 = new TwitterApi({
  appKey: process.env.CONSUMER_KEY_4,
  appSecret: process.env.CONSUMER_SECRET_4,
  accessToken: process.env.ACCESS_TOKEN_4,
  accessSecret: process.env.ACCESS_TOKEN_SECRET_4,
}, { httpAgent })

const client5 = new TwitterApi({
  appKey: process.env.CONSUMER_KEY_5,
  appSecret: process.env.CONSUMER_SECRET_5,
  accessToken: process.env.ACCESS_TOKEN_5,
  accessSecret: process.env.ACCESS_TOKEN_SECRET_5,
}, { httpAgent })
let count = 0

const imgApi = 'https://api.btstu.cn/sjbz/api.php?lx=fengjing&format=images&method=pc'
const imgInit = './srcImg/show.png'

// Timing loop posting time: once every 5 minutes
const interval = 1000 * 60 * 5;

// tweet content
const tweetStatus = ' #推特刷粉 #推特粉丝  #推特刷粉平台 #推特刷赞 #推特涨粉 #shuazan.top ';

// img src
const imgPath = './mergeImg/image.png'

const filterNumber = (num) => {
  if (0 <= num && num <= 50) {
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
    await fs.unlink('./mergeImg/image.png', (err) => {
      if (err) throw err;
      console.log('File has been deleted!');
    });
    console.log('success count:', count);

  } catch (error) {
    count++
    console.log('count:', count);

    console.error('Error:', error);
  }
}

postTweetWithImage(tweetStatus);

setInterval(async () => {
  try {
    await postTweetWithImage(tweetStatus);
  } catch (error) {
    console.error('Error:', error);
  }
}, interval);