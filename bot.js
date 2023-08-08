import { TwitterApi } from 'twitter-api-v2';
import { config } from "dotenv";
import { HttpsProxyAgent } from 'https-proxy-agent';
config();

const proxy = process.env.HTTP_PROXY
const httpAgent = new HttpsProxyAgent(proxy);
// OAuth 1.0a (User context)
const client = new TwitterApi({
  appKey: process.env.CONSUMER_KEY,
  appSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
}, { httpAgent })


// 定时循环发帖时间： 5 分钟一次
const interval = 1000 * 60 * 5;
// 推文内容
const tweetStatus = 'This is a AutoPublish test!  #AutoPublish  ';
// 图片地址
const imgPath = './test.png'



async function postTweetWithImage (status) {
  try {
    const mediaIds = await Promise.all([
      client.v1.uploadMedia(imgPath),
    ]);

    const newTweet = await client.v2.tweet({
      text: status,
      media: { media_ids: mediaIds }
    });
    console.log('推文已发布:', newTweet.data.text);
  } catch (error) {
    console.error('发帖失败:', error);
  }
}
postTweetWithImage(tweetStatus);

 // 定时循环发帖
// setInterval(() => {
//   postTweetWithImage(tweetStatus);
// }, interval);

