import { Router } from 'express'
import config from '../../config.js'
import wxService from '../../service/wx/index.js';
import token from '../../middleware/token.js';


const router = Router();
// 微信服务器校验
router.get('/', (req, res) => {
  let { signature, echostr, timestamp, nonce } = req.query;
  let token = config.token;
  let isValid = wxService.wxVerification(signature, token, timestamp, nonce);
  // 微信服务器发送的信息，并且已经确认了
  if (isValid) {
    res.send(echostr);
  } else {
    // 不是微信服务器发送的信息
    res.send("你好")
  }
})
// 微信消息处理/微信公众号信息转发
router.post("/", async (req, res) => {
  // 1 解析微信服务器发送过来的xml信息
  let xmlBody = req.body.xml;
  // 2 组装要回复给微信服务器的xml信息
  let xmlStr = await wxService.handleMessage(xmlBody);
  res.send(xmlStr);
})

// 生成公众号自定义菜单 acesstoken
router.get("/handleMenu", token, async (req, res) => {
  let access_token = req.access_token;
  let data = await wxService.handleMenu(access_token);
  res.send(data);
})
// 发送客服消息
router.get("/handleCustomServiceMsg", token, async (req, res) => {
  let access_token = req.access_token;
  let { openid, content } = req.query;
  let result = await wxService.handleCustomServiceMsg(access_token, openid, content);
  console.log(result);
  res.send(result);
})
// 获取图片素材列表
router.get("/handlePicMaterialList", token, async (req, res) => {
  let access_token = req.access_token;
  let { offset, count } = req.query;
  let options = {
    "type": "image",
    "offset": offset,
    "count": count
  }
  let result = await wxService.handlePicMaterialList(access_token, options)
  res.send(result)
})
// 发送模板消息
router.get("/handleTemplateMsg", token, async (req, res) => {
  let { openid } = req.query;
  let access_token = req.access_token;
  let result = await wxService.handleTemplateMsg(access_token, openid);
})
// 获取带参数的二维码
router.get("/handleTempQrcode", token, async (req, res) => {
  let access_token = req.access_token;
  let { expire_seconds, scene_id } = req.body;
  let url = await wxService.handleTempQrcode(access_token, expire_seconds, scene_id);
  console.log(url);
  res.redirect(url)
})
// wx jssdk 授权签名
router.get("/jsSdkAuthorized", async (req, res) => {
  let url = decodeURIComponent(req.query.url);
  let signatureObj = await wxService.jsSdkAuthorized(url);
  res.send(signatureObj)
})
// wx 网页授权 snsapi_base
router.get("/wxPageAuthrizedBase", async (req, res) => {
  const { code, state } = req.query;
  let { openid } = await wxService.wxPageAuthrizedBase(code, state);
  res.send({ openid })
})
// wx 网页授权 snsapi_userinfo
router.get("/wxPageAuthrizedUserInfo", async (req, res) => {
  const { code, state } = req.query;
  let userinfo = await wxService.wxPageAuthrizedUserInfo(code, state);
  res.send(userinfo)
})
// 星火大模型中转
router.get("/handleToSpark", async (req, res) => {
  // 拿到code
  const { code, state } = req.query;
  let { nickname, language, city, province, country, headimgurl, privilege, unionid } = await wxService.wxPageAuthrizedUserInfo(code, state);

  res.cookie("info", JSON.stringify({
    nickname, language, city, province, country, headimgurl, privilege, unionid
  }), { maxAge: 1000 * 60 * 60 })
  res.redirect(`/dist/index.html?nickname=${nickname}&headimgurl=${headimgurl}`)
})

// 星火大模型中转
router.get("/handleToSparkRedirect", async (req, res) => {
  let spark_url = wxService.concatUrl();
  res.redirect(spark_url)
})
export default router;