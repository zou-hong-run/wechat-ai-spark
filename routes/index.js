import wechat from '../controller/wx/index.js'
/**
 * 
 * @param {Express} app
 */
const initRouter = (app) => {
  app.use("/wechat", wechat);
  // app.use("/dingding")/

}

export default initRouter