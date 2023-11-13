import axios from 'axios';
import { mergeImages } from './mergeImg.js';
import { TwitterApi } from 'twitter-api-v2';
import { config } from "dotenv";
import { HttpsProxyAgent } from 'https-proxy-agent';

config();

const proxy = process.env.HTTP_PROXY;
const httpAgent = new HttpsProxyAgent(proxy);

const accounts = Array.from({ length:  process.env.ACCOUNT_NUMBER }, (_, i) => ({
  appKey: process.env[`CONSUMER_KEY_${i + 1}`],
  appSecret: process.env[`CONSUMER_SECRET_${i + 1}`],
  accessToken: process.env[`ACCESS_TOKEN_${i + 1}`],
  accessSecret: process.env[`ACCESS_TOKEN_SECRET_${i + 1}`],
}));

const clients = accounts.map(account => 
  new TwitterApi(account, { httpAgent })
);

const clientTweetCounts = accounts.map(() => 0);

const imgApi = 'https://api.btstu.cn/sjbz/api.php?lx=fengjing&format=images&method=pc';
const imgInit = './srcImg/show.png';

const interval = 1000 * 60 * 5; 

const tweetStatus = ' #推特加粉 #推特粉丝  #推特加粉平台 #推特加赞 #推特涨粉 #Youtube #IG #shuazan.xyz ';

const imgPath = './mergeImg/image.png'

const getTitle = async () => {
  const { data: { hitokoto } } = await axios.get('https://v1.hitokoto.cn')
  return hitokoto
}

async function postTweetWithImage (status) {
  try {
    const clientIndex = clientTweetCounts.indexOf(Math.min(...clientTweetCounts));
    const client = clients[clientIndex];

    const title = await getTitle()
    await mergeImages(imgApi, imgInit)
    const mediaIds = await Promise.all([
      client.v1.uploadMedia(imgPath),
    ]);

    const newTweet = await client.v2.tweet({
      text: title + status,
      media: { media_ids: mediaIds }
    });

    clientTweetCounts[clientIndex]++;
    console.log('Success:', newTweet.data.text);
    console.log('Tweet count for client', clientIndex, ":", clientTweetCounts[clientIndex]);

  } catch (error) {
    console.error('Error:', error);
  }
}

setInterval(async () => {
  if (clientTweetCounts.every(count => count >= 50)) {
    process.exit(0);
  }
  
  try {
    await postTweetWithImage(tweetStatus);
  } catch (error) {
    console.error('Error:', error);
  }

}, interval);
