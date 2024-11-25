import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import api from '../api/index.js';
import { getAccessToken } from './getAccessToken.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getApiTicket = async () => {
  let currentTime = Date.now();
  let ApiTicketJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../apiTicket.json")));
  // console.log(ApiTicketJson, "gege");
  // 如果失效，重新请求
  if (ApiTicketJson.ticket == '' || ApiTicketJson.expires_time < currentTime) {
    let access_token = await getAccessToken()
    let { ticket, expires_in } = await api.getTicket(access_token);
    console.log("api_ticket失效 get remote: api_ticket");
    ApiTicketJson.ticket = ticket;
    // expires_in单位秒
    ApiTicketJson.expires_time = Date.now() + (expires_in - 300) * 1000;
    fs.writeFileSync(path.resolve(__dirname, "../apiTicket.json"), JSON.stringify(ApiTicketJson));
    return ApiTicketJson.ticket
  } else {// 从本地获取
    console.log("get local: api_ticket");
    return ApiTicketJson.ticket;
  }
}