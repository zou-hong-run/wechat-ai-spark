import { getAccessToken } from "../utils/getAccessToken.js";

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
const token = async (req, res, next) => {
  let access_token = await getAccessToken();
  req.access_token = access_token;
  next()
};

export default token;