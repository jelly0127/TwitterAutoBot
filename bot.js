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


// Timing loop posting time: once every 5 minutes
const interval = 1000 * 60 * 5;
// tweet content
const tweetStatus = 'This is a AutoPublish test!  #AutoPublish  ';
// img src
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
    console.log('Success:', newTweet.data.text);
  } catch (error) {
    console.error('Error:', error);
  }
}
postTweetWithImage(tweetStatus);

 // timed loop posting
// setInterval(() => {
//   postTweetWithImage(tweetStatus);
// }, interval);

