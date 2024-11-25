// https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
import axios from 'axios';
let base_url = "https://api.weixin.qq.com";
const getAccessToken = async (appid, secret) => {
  let url = `${base_url}/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
  try {
    let res = await axios.get(url);
    return res.data
  } catch (error) {
    console.log("error", error);
  }
}
const createMenu = async (access_token, data) => {
  let url = `${base_url}/cgi-bin/menu/create?access_token=${access_token}`;
  try {
    let res = await axios({
      method: "post",
      url,
      data
    })
    return res.data
  } catch (error) {
    console.log(error);
  }
}
const sendCustomServiceMsg = async (access_token, data) => {
  let url = `${base_url}/cgi-bin/message/custom/send?access_token=${access_token}`;
  try {
    let res = await axios({
      method: "post",
      url,
      data
    })
    return res.data
  } catch (error) {
    console.log(error);
  }
}
const getMaterialList = async (access_token, data) => {
  let url = `${base_url}/cgi-bin/material/batchget_material?access_token=${access_token}`;
  try {
    let res = await axios({
      method: "post",
      url,
      data
    })
    return res.data
  } catch (error) {
    console.log(error);
  }
}
const sendTemplateMsg = async (access_token, data) => {
  let url = `${base_url}/cgi-bin/message/template/send?access_token=${access_token}`;
  try {
    let res = await axios({
      method: "post",
      url,
      data
    })
    return res.data
  } catch (error) {
    console.log(error);
  }
}
const getTempQrcode = async (access_token, data) => {
  let url = `${base_url}/cgi-bin/qrcode/create?access_token=${access_token}`;
  try {
    let res = await axios({
      method: "post",
      url,
      data
    })
    return res.data
  } catch (error) {
    console.log(error);
  }
}
const getTicket = async (access_token) => {
  let url = `${base_url}/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;
  try {
    let res = await axios.get(url);
    return res.data
  } catch (error) {
    console.log(error);
  }
}

const getAccessTokenByCode = async (appid, secret, code) => {
  let url = `${base_url}/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`
  try {
    let res = await axios.get(url);
    return res.data
  } catch (error) {
    console.log(error);
  }
}
const getWxUserInfo = async (access_token, openid) => {
  let url = `${base_url}/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
  try {
    let res = await axios.get(url);
    return res.data
  } catch (error) {
    console.log(error);
  }
}
export default {
  getAccessToken,
  createMenu,
  sendCustomServiceMsg,
  getMaterialList,
  sendTemplateMsg,
  getTempQrcode,
  getTicket,
  getAccessTokenByCode,
  getWxUserInfo
}