const  ResponseStatus  = require('./httpStatus.js');

const sendResponse = (res, {
  statusCode = 200,
  message = '',
  data = null,
  meta = {},
  status,
} = {}) => {

  if (!status) {
    if (statusCode >= 200 && statusCode < 300) status = ResponseStatus.SUCCESS;
    else if (statusCode >= 400 && statusCode < 500) status = ResponseStatus.FAIL;
    else status = ResponseStatus.ERROR;
  }

  if (Array.isArray(data)) {
    meta.length = data.length;
  }

  meta.timestamp = new Date().toISOString();

  const responseBody = {
    statusCode,
    status,
    message,
    meta,
    data,
  };

  return res.status(statusCode).json(responseBody);
};

module.exports = sendResponse;
