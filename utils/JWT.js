const JWT = require(`jsonwebtoken`);

module.exports.generateToken = (payload) => {
  const token = JWT.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

module.exports.isTokenValid = (token) =>
  JWT.verify(token, process.env.JWT_SECRET_KEY);
