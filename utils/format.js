
/**
 * 
 * @param {object} xmlObj 
 */
const formatXml = (xmlObj) => {
  let msg = {};
  if (typeof xmlObj === 'object') {
    const keys = Object.keys(xmlObj);
    keys.forEach(key => {
      let val = xmlObj[key];
      if (Array.isArray(val) && val.length > 0) {
        msg[key] = val[0];
      }
    })
  }
  return msg;
}
export default formatXml;