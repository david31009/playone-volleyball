require('dotenv').config();

const { TOKEN_SECRET } = process.env;
const jwt = require('jsonwebtoken');

// reference: https://thecodebarbarian.com/80-20-guide-to-express-error-handling
const wrapAsync = (fn) => {
  return function (req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
};

const auth = async (req, res, next) => {
  let jwtToken = req.header('Authorization');

  // 沒 token，後端阻擋
  if (jwtToken === 'Bearer null') {
    res.status(401).json({ error: 'No token' });
    return;
  }
  jwtToken = jwtToken.replace('Bearer ', '');

  // 解 jwt token
  let user;
  try {
    user = jwt.verify(jwtToken, TOKEN_SECRET);

    // 將 user 資料存進 req.user 往下傳遞
    req.user = user;
    next();
  } catch {
    res.status(403).json({ error: 'Wrong token' });
  }
};

module.exports = {
  wrapAsync,
  auth
};
