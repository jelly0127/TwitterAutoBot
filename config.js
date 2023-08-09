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

export {client1,client2,client3,client4,client5 }