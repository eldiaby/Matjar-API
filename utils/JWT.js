const JWT = require(`jsonwebtoken`);
const ms = require(`ms`);

const generateToken = (payload) => {
  const token = JWT.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

module.exports.isTokenValid = (token) =>
  JWT.verify(token, process.env.JWT_SECRET_KEY);

module.exports.attackCookiesToResponse = ({ res, tokenUser: user }) => {
  const token = generateToken(user);

  res.cookie(`token`, token, {
    httpOnly: true, //Prevent client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
    sameSite: 'strict', // Helps protect against CSRF attacks
    secure: true,
    signed: true,
    expires: new Date(
      Date.now() + ms(process.env.JWT_COOKIE_EXPIRES_IN || `1d`)
    ), // Cookie expiration: 1 day
  });
};
