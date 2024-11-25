配合视频教程使用
https://www.bilibili.com/video/BV14E421A7Gr/

修改 sftp.json 为自己的信息
将 sftp.json.example 改为 sftp.json

```sftp.json
{
  "name": "wechat-demo",
  "host": "xxx.com",
  "protocol": "ftp",
  "port": 21,
  "username": "xxx",
  "password": "xxx",
  "remotePath": "/",
  "uploadOnSave": true,
  "useTempFile": false,
  "openSsh": false,
  "connectTimeout": 500
}


```

修改 config.js 配置信息
将 config.js.example 改为 config.js

```
let config = {
  // http服务
  http_port: 80,
  // https服务
  https_port: 443,
  token: "xxx",
  // 项目上线使用正式的即可
  appid: 'xx',
  appsecret: 'xx',
  server_url: "xxx"
  // server_url: "http://www.xxx.xxx"
}
export default config
```
