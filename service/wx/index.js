import formatXml from "../../utils/format.js";
import { wxJsSdkSignature, wxVerificationSignature } from "../../utils/signature.js";
import responseMsgService from "./responseMsg.js";
import xmlTemplate from "../../utils/template.js";
import api from "../../api/index.js";
import config from "../../config.js";
import { getNonceStr } from '../../utils/index.js'
import { getApiTicket } from "../../utils/getApiTicket.js";
const wxService = {
  /**
     * 微信服务器校验
     * @param {*} signature 
     * @param {*} token 
     * @param {*} timestamp 
     * @param {*} nonce 
     */
  wxVerification(signature, token, timestamp, nonce) {
    let tempStr = wxVerificationSignature(token, timestamp, nonce);
    if (signature === tempStr) {
      return true
    }
    return false
  },
  /**
   * 处理消息
   * @param {*} xmlBody 
   * {
        tousername: [ 'gh_5c1536d9fcc6' ],
        fromusername: [ 'oiR8u6zStO-sPpOKwn0ZcD9e36Yg' ],
        createtime: [ '1715781554' ],
        msgtype: [ 'text' ],
        content: [ '3' ],
        msgid: [ '24564085076247858' ]
      }
   */
  async handleMessage(xmlBody) {
    // console.log(xmlBody);
    // 1.解析用户发送过来xml的信息
    let msg = formatXml(xmlBody);
    // console.log("comming", msg);
    // 2.根据1.的数据，组装要回复的消息
    const repsonseOptions = await responseMsgService.matchMsgType(msg);
    // 3.根据2.的数据，组装好要回复的xml
    let xmlStr = xmlTemplate(repsonseOptions);// xml格式的数据
    // 4.返回要回复的xml数据
    return xmlStr
  },
  /**
   * 生成公众号菜单
   * @param {*} access_token 
   */
  async handleMenu(access_token) {
    console.log("create", config.server_url);
    let qrcode_url = `${config.server_url}/wechat/handleTempQrcode`;

    let redirect_base_uri = encodeURIComponent(config.server_url + "/wechat/wxPageAuthrizedBase")
    let base_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appid}&redirect_uri=${redirect_base_uri}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;

    let redirect_userinfo_uri = encodeURIComponent(config.server_url + "/wechat/wxPageAuthrizedUserInfo")
    let userinfo_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appid}&redirect_uri=${redirect_userinfo_uri}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;



    let redirect_spark_url = encodeURIComponent(config.server_url + "/wechat/handleToSpark");
    let spark_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appid}&redirect_uri=${redirect_spark_url}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;

    let menuParams = {
      "button": [
        {
          "name": "功能菜单",
          "sub_button": [
            {
              "type": "click",
              "name": "客服消息测试",
              "key": "customservice_test"
            },
            {
              "type": "click",
              "name": "获取一张图片",
              "key": "get_pic"
            },
            {
              "type": "click",
              "name": "获取模板消息",
              "key": "get_template_msg"
            }]
        },
        {
          "name": "跳转菜单",
          "sub_button": [
            {
              "type": "view",
              "name": "获取带参数的二维码",
              "url": qrcode_url
            },
            {
              "type": "view",
              "name": "微信jssdk页面",
              "url": config.server_url
            },
            {
              "type": "view",
              "name": "获取用户信息baseinfo",
              "url": base_url
            },
            {
              "type": "view",
              "name": "获取用户信息userinfo",
              "url": userinfo_url
            },
            {
              "type": "view",
              "name": "星火大模型对话页面",
              "url": spark_url
            }
          ]
        }
      ]
    };
    let data = await api.createMenu(access_token, menuParams);
    return data;
  },
  /**
   * 发送客服信息
   */
  async handleCustomServiceMsg(access_token, openid, content) {
    let data = {
      "touser": openid,
      "msgtype": "text",
      "text":
      {
        "content": content
      }
    }
    let result = await api.sendCustomServiceMsg(access_token, data);
    return result
  },
  /**
   * 获取图片素材列表
   */
  async handlePicMaterialList(access_token, options) {
    let res = await api.getMaterialList(access_token, options);
    return res;
  },
  /**
   * 发送模板信息
   * 
   */
  async handleTemplateMsg(access_token, openid) {
    let data = {
      "touser": openid,
      "template_id": "DhIM8Odhz1NhIYYXr6ATRDD3RLajnZagFXRkMSFNf94",
      "url": "http://baidu.com",
      "data": {
        "keyword1": {
          "value": "测试",
          "color": "#173177"
        },
        "keyword2": {
          "value": "red润",
          "color": "#eee"
        },
        "keyword3": {
          "value": "我是谁",
          "color": "#fff"
        }
      }
    };
    let res = await api.sendTemplateMsg(access_token, data);
    return res;
  },
  // 生成参数二维码 七天过期时间
  async handleTempQrcode(access_token, expire_seconds = 604800, scene_id = 1) {
    // 临时二维码参数
    let data = { expire_seconds, action_name: "QR_SCENE", action_info: { "scene": { "scene_id": scene_id } } }
    let { ticket } = await api.getTempQrcode(access_token, data);
    let codeUrl = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQFO8TwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyNGROQzlpOXZjS0gxdzRqNDFDMU0AAgSE2HpmAwSAOgkA`;
    return codeUrl;
  },
  // jssdk校验
  async jsSdkAuthorized(url) {
    let noncestr = getNonceStr();
    let jsapi_ticket = await getApiTicket();
    let timestamp = Date.now();
    let signature = await wxJsSdkSignature(url, noncestr, timestamp, jsapi_ticket);
    let signatureObj = {
      appId: config.appid,
      jsapi_ticket,
      noncestr,
      signature,
      timestamp,
      url
    }
    return signatureObj;
  },
  // base
  async wxPageAuthrizedBase(code, state) {
    console.log("step1:", code, state);
    // 根据code获取access_token
    let { access_token, expires_in, refresh_token, openid } = await api.getAccessTokenByCode(config.appid, config.appsecret, code);
    console.log("step2:", access_token, expires_in, refresh_token, openid);
    return {
      access_token, expires_in, refresh_token, openid
    }
  },
  // userinfo
  async wxPageAuthrizedUserInfo(code, state) {
    console.log("step1:", code, state);
    // 根据code获取access_token
    let { access_token, expires_in, refresh_token, openid } = await api.getAccessTokenByCode(config.appid, config.appsecret, code);
    console.log("step2:", access_token, expires_in, refresh_token, openid);
    // step3 刷新token 忽略，自己实现
    // step4 
    let result = await api.getWxUserInfo(access_token, openid);
    return result
  },
  /**
   * 拼接重定向路径
   * @returns 
   */
  concatUrl() {
    let redirect_spark_url = encodeURIComponent(config.server_url + "/wechat/handleToSpark");
    let spark_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appid}&redirect_uri=${redirect_spark_url}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
    return spark_url
  }

}

export default wxService;