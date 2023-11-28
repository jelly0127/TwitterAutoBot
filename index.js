import axios from 'axios';
import { mergeImages } from './mergeImg.js';
import { TwitterApi } from 'twitter-api-v2';
import { config } from "dotenv";
import express from 'express';
// import { HttpsProxyAgent } from 'https-proxy-agent';
import nodemailer from 'nodemailer'; 

config();
const app = express();
// const proxy = process.env.HTTP_PROXY;
// const httpAgent = new HttpsProxyAgent(proxy);

const accounts = Array.from({ length:  process.env.ACCOUNT_NUMBER }, (_, i) => ({
  appKey: process.env[`CONSUMER_KEY_${i + 1}`],
  appSecret: process.env[`CONSUMER_SECRET_${i + 1}`],
  accessToken: process.env[`ACCESS_TOKEN_${i + 1}`],
  accessSecret: process.env[`ACCESS_TOKEN_SECRET_${i + 1}`],
}));

// const clients = accounts.map(account => 
//   new TwitterApi(account, { httpAgent })
// );
const clients = accounts.map(account => 
  new TwitterApi(account)
);

const clientTweetCounts = accounts.map(() => 0);

const imgApi = 'https://api.btstu.cn/sjbz/api.php?lx=fengjing&format=images&method=pc';
const imgInit = './srcImg/show.png';

const interval = 1000 * 60 * 3; 

const tweetStatus = '#推特刷粉 #Youtube刷订阅 #刷粉平台 #Tiktok刷赞 #Tiktok刷粉 #Instagram刷赞 #电报拉人 #电报邀请 #刷赞网 #推特加粉 #推特粉丝  #推特加粉平台 #推特加赞 #推特涨粉 #Youtube #IG #shuazan.xyz ';

const imgPath = './mergeImg/image.png'

const getTitle = async () => {
  const { data: { hitokoto } } = await axios.get('https://v1.hitokoto.cn')
  return hitokoto
}
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',//QQ邮箱的SMTP服务器
  port: 587,//QQ邮箱的SMTP服务器的端口为465或587
  secure: false, // true for 465, false for other ports
  auth: {
    user: '806352173@qq.com', // 刚刚申请授权码的邮箱账号
    pass: 'huzwtuahciirbfgi' // 刚刚申请的授权码
  }
});
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
    clientTweetCounts[clientIndex]++;
    console.error('Error:', error,clientIndex);
      // 发送邮件提醒
      const mailOptions = {
        from: '806352173@qq.com', // 发送邮件的邮箱
        to: '2582115921@qq.com', // 接收邮件的邮箱
        subject: '推特机器人发生错误',
        text: `错误 `,
        html: `<p>推特机器人错误通知</p>
        <p >错误信息：${error} </p>
        <p >错误账号Index: ${clientIndex} </p>
        `
      };
  
    await  transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('邮件发送失败:', err);
        } else {
          console.log('邮件发送成功:', info);
        }
      });
    }
  }

app.get('/', async (req,res) =>{
  return res.send('Follow documentation ')
})


app.listen(8999, async () => {
  console.log('start');
setInterval(async () => {
  try {
    await postTweetWithImage(tweetStatus);
  } catch (error) {
    console.error('Error:', error);

  }

}, interval);
})

