import axios from 'axios';
import { mergeImages } from './mergeImg.js';
import { TwitterApi } from 'twitter-api-v2';
import { config } from "dotenv";
import nodemailer from 'nodemailer';

config();

// 从环境变量中获取账号信息
const accounts = Array.from({ length: process.env.ACCOUNT_NUMBER }, (_, i) => ({
  appKey: process.env[`CONSUMER_KEY_${i + 1}`],
  appSecret: process.env[`CONSUMER_SECRET_${i + 1}`],
  accessToken: process.env[`ACCESS_TOKEN_${i + 1}`],
  accessSecret: process.env[`ACCESS_TOKEN_SECRET_${i + 1}`],
}));

// 初始化 Twitter 客户端
const clients = accounts.map(account =>
  new TwitterApi(account)
);

// 记录每个客户端的推文计数
const clientTweetCounts = accounts.map(() => 0);

// 图片 API 和初始图片路径
const imgApi = 'https://api.btstu.cn/sjbz/api.php?lx=fengjing&format=images&method=pc';
const imgInit = './srcImg/show.png';
const imgPath = './mergeImg/image.png';

// 推文状态和发送间隔
const tweetStatus = '#推特刷粉 #Youtube刷订阅 #刷粉平台 #Tiktok刷赞 #Tiktok刷粉 #Instagram刷赞 #电报拉人 #电报邀请 #刷赞网 #推特加粉 #推特粉丝 #推特加粉平台 #推特加赞 #推特涨粉 #Youtube #IG #shuazan.xyz ';
const interval = 1000 * 60 * 3;

// 获取一言的异步函数
const getTitle = async () => {
  const { data: { hitokoto } } = await axios.get('https://v1.hitokoto.cn');
  return hitokoto;
};

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',  // QQ邮箱的SMTP服务器
  port: 587,            // QQ邮箱的SMTP服务器的端口为465或587
  secure: false,        // true for 465, false for other ports
  auth: {
    user: '806352173@qq.com',  // 刚刚申请授权码的邮箱账号
    pass: 'huzwtuahciirbfgi'   // 刚刚申请的授权码
  }
});

// 发推文并附带图片的异步函数
async function postTweetWithImage (status) {
    // 找到推文计数最小的客户端
    const clientIndex = clientTweetCounts.indexOf(Math.min(...clientTweetCounts));
    const client = clients[clientIndex];
  try {
    // 获取一言并合并图片
    const title = await getTitle();
    await mergeImages(imgApi, imgInit);

    // 上传图片并获取 mediaIds
    const mediaIds = await Promise.all([
      client.v1.uploadMedia(imgPath),
    ]);

    // 发送推文
    const newTweet = await client.v2.tweet({
      text: title + status,
      media: { media_ids: mediaIds }
    });

    // 更新推文计数并输出成功信息
    clientTweetCounts[clientIndex]++;
    console.log('Success:', newTweet.data.text);
    console.log('Tweet count for client', clientIndex, ":", clientTweetCounts[clientIndex]);

  } catch (error) {
    // 发生错误时更新推文计数，并发送错误邮件提醒
    clientTweetCounts[clientIndex]++;
    console.error('Error:', error, clientIndex);

    const mailOptions = {
      from: '806352173@qq.com',
      to: '2592115921@qq.com',
      subject: '推特机器人发生错误',
      text: `错误 `,
      html: `<p>推特机器人错误通知</p>
        <p >错误信息：${error} </p>
        <p >错误账号Index: ${clientIndex} </p>
      `
    };

    // 发送错误邮件
    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('邮件发送失败:', err);
      } else {
        console.log('邮件发送成功:', info);
      }
    });
  }
}

// 定时发送推文
setInterval(async () => {
  try {
    await postTweetWithImage(tweetStatus);
  } catch (error) {
    console.error('Error:', error);
  }
}, interval);
