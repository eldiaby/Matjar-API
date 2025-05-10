const asyncHandler = require(`express-async-handler`);

const Token = require('./../models/tokenModel.js');

const { isTokenValid } = require(`../utils/JWT.js`);
const { attachCookiesToResponse } = require(`../utils/JWT.js`);

const CustomError = require(`../errors/index.js`);

module.exports.authenticateUser = asyncHandler(async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload;
      return next();
    }

    const payload = await isTokenValid(refreshToken);

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    }).lean();

    if (!existingToken || !existingToken.isValid) {
      throw new CustomError.UnauthenticatedError(`Authentication Invalid`);
    }

    attachCookiesToResponse({
      res,
      tokenUser: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    req.user = payload.user;

    next();
  } catch (error) {
    console.log(error);
    throw new CustomError.UnauthenticatedError(`Authentication Invalid`);
  }
});
