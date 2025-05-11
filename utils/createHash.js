const crypto = require('node:crypto');

module.exports.createHash = (string) =>
  crypto.createHash('md5').update(string).digest('hex');
