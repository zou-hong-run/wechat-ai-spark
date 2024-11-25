import sha1 from 'sha1';

/**
 * 
 * @param {*} token 
 * @param {*} timestamp 
 * @param {*} nonce 
 */
export const wxVerificationSignature = (token, timestamp, nonce) => {
  let signature = [token, timestamp, nonce].sort().join("");
  signature = sha1(signature);
  return signature
}

const sortAndConcatObj = (obj) => {
  let keys = Object.keys(obj);
  keys = keys.sort();
  let str = "";
  keys.forEach(key => {
    str += `${key}=${obj[key]}&`;
  });
  str = str.slice(0, -1)
  return str
}

export const wxJsSdkSignature = async (url, noncestr, timestamp, jsapi_ticket) => {
  let obj = {
    noncestr,
    jsapi_ticket,
    timestamp,
    url
  };
  let str = sortAndConcatObj(obj);
  let signature = sha1(str);
  return signature;
}