import express from "express";// esmodule
// http服务
// https服务
import http from 'http';
import https from 'https';
import config from './config.js';
import { getIpAddress } from './utils/index.js'
import fs from 'fs'
import cors from 'cors'
import cookieParser from "cookie-parser";
import xmlparser from "express-xml-bodyparser";
import initRouter from "./routes/index.js";

const httpsOption = {
  key: fs.readFileSync('./ssl/server.key', 'utf-8'),
  cert: fs.readFileSync('./ssl/server.pem', 'utf-8')
}

const app = express();
// 解决跨域
app.use(cors());
// 解析cookie
app.use(cookieParser());
// 解析xml数据
app.use(xmlparser())
// 静态文件目录
app.use(express.static("public"))

initRouter(app)

const initServer = () => {
  let servers = https.createServer(httpsOption, app);
  let server = http.createServer(app);

  servers.listen(config.https_port, () => {
    console.log(`running on https://${getIpAddress()}:${config.https_port}`);
  })
  server.listen(config.http_port, () => {
    console.log(`running on http://${getIpAddress()}:${config.http_port}`);
  })
}
initServer()

