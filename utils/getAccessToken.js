import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import api from '../api/index.js';
import config from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appid = config.appid;
const secret = config.appsecret;

export const getAccessToken = async () => {
  // 判断当前token是否存在，如果存在就获取当前的token，如果存在，但是过期了，就重新生成token，如果没有token，那也重新生成token

  // 获取当前的时间
  let currentTime = Date.now();

  // 获取本地的存放的accesstoken
  let accessTokenJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../accessToken.json")));
  // console.log(currentTime, accessTokenJson.expires_time);
  // console.log(currentTime < accessTokenJson.expires_time);
  // 如果失效，重新请求
  if (accessTokenJson.access_token == '' || accessTokenJson.expires_time < currentTime) {
    // 获取新的token
    // console.log(appid, secret)
    let { access_token, expires_in } = await api.getAccessToken(appid, secret);
    console.log(`access_token失效 get remote`);
    accessTokenJson.access_token = access_token;
    // expires_in单位秒 5分钟 
    accessTokenJson.expires_time = Date.now() + (expires_in - 300) * 1000;
    fs.writeFileSync(path.resolve(__dirname, "../accessToken.json"), JSON.stringify(accessTokenJson));
    return accessTokenJson.access_token
  } else {// 从本地获取
    console.log(`get local: access_token`);
    return accessTokenJson.access_token;
  }
}