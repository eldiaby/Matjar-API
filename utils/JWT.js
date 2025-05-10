// ==========================
// 📦 IMPORTS
// ==========================
const JWT = require('jsonwebtoken'); // JWT library to handle token creation and verification
const ms = require('ms'); // ms library to handle human-readable time format (e.g., '1d' for 1 day)

// ==========================
// 🛠️ FUNCTION: generateToken
// ==========================
/**
 * @desc    Generate a JWT token
 * @param   {Object} payload - The payload data to include in the token
 * @returns {String} - The generated JWT token
 */
const generateToken = (payload) => {
  const token = JWT.sign(
    payload,
    process.env.JWT_SECRET_KEY
    // , {
    // expiresIn: process.env.JWT_EXPIRES_IN, // Set token expiration from environment
    // }
  );

  return token; // Return the token
};

// ==========================
// 🛠️ FUNCTION: isTokenValid
// ==========================
/**
 * @desc    Validate the given JWT token
 * @param   {String} token - The JWT token to validate
 * @returns {Boolean} - Returns true if the token is valid
 */
module.exports.isTokenValid = (token) =>
  JWT.verify(token, process.env.JWT_SECRET_KEY); // Verify the token with the secret key

// ==========================
// 🛠️ FUNCTION: attachCookiesToResponse
// ==========================
/**
 * @desc    Attach the JWT token as a cookie to the response
 * @param   {Object} params - The response object and token user data
 * @param   {Object} params.res - The Express response object
 * @param   {Object} params.tokenUser - The user object to create token for
 */

module.exports.attachCookiesToResponse = ({
  res,
  tokenUser: user,
  refreshToken,
}) => {
  const accesstokenJWT = generateToken(user); // Generate the JWT access token
  const refreshTokenJWT = generateToken({ user, refreshToken }); // Generate the JWT refresh token

  // Attach the JWT access token as a cookie to the response
  res.cookie('accessToken', accesstokenJWT, {
    httpOnly: true, // Prevent JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    sameSite: 'strict', // Helps prevent CSRF attacks
    signed: true, // Ensure the cookie is signed
    maxAge: ms(process.env.JWT_ACCESS_TOKEN_COOKIE_EXPIRES_IN || '1d'), // Set expiration (1 day by default)
  });

  // Attach the JWT refresh token as a cookie to the response
  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true, // Prevent JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    sameSite: 'strict', // Helps prevent CSRF attacks
    signed: true, // Ensure the cookie is signed
    maxAge: ms(process.env.JWT_REFRESH_TOKEN_COOKIE_EXPIRES_IN || '30d'), // Set expiration ( 1Month by default)
  });
};
