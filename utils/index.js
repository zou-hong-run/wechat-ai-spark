
import { networkInterfaces } from 'os'

/**
 * 返回随机字符串
 * @returns 
 */
export const getNonceStr = () => {
  return Math.random().toString(16).substring(2, 15)
}

/**
 * 获取本机ip地址
 * @returns {string}
 */
export const getIpAddress = () => {
  const interfaces = networkInterfaces();
  let ip = "";
  for (let devName in interfaces) {
    let iface = interfaces[devName];
    let config = iface
      .find(item => item.family === "IPv4" && item.address !== "127.0.0.1" && !item.internal)
    if (config) {
      ip = config.address
    }
  }
  if (ip) {
    return ip;
  } else {
    return false
  }
}