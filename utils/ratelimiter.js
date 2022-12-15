require('dotenv').config();
const Cache = require('./cache');

// 每 (window) 秒內送出 (QUOTA) 個請求
const { QUOTA, WINDOW } = process.env;

async function rateLimiter(token) {
  // 若 key 存在，則不重新 set key (NX: true)
  const replies = await Cache.multi().set(token, 0, { EX: 60, NX: true }).incr(token).exec();

  const reqCount = replies[1];
  if (reqCount > QUOTA) {
    return {
      status: 429,
      message: `Quota of ${QUOTA} per ${WINDOW} sec exceeded`
    };
  }
  return { status: 200, message: 'OK' };
}

const rateLimiterRoute = async (req, res, next) => {
  if (!Cache.ready) {
    // Redis is not connected
    return next();
  }
  try {
    const token = req.ip;
    const result = await rateLimiter(token);

    if (result.status === 200) {
      return next();
    } else {
      res.status(result.status).send(result.message);
      return;
    }
  } catch (e) {
    return next();
  }
};

module.exports = { rateLimiterRoute };
