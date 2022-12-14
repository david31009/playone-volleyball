require('dotenv').config();

const Joi = require('joi');
const { TOKEN_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const validator = require('validator');

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

const injectionCheck = async (req, res, next) => {
  const info = req.body;
  const keys = Object.keys(info);
  for (let i = 0; i < keys.length; i++) {
    if (info[keys[i]] === null) info[keys[i]] = '';
    info[keys[i]] = validator.escape(info[keys[i]]);
  }
  next();
};

const inputCheck = async (req, res, next) => {
  const info = req.body;
  const schema = Joi.object().keys({
    groupId: Joi.string(),
    title: Joi.string().max(20),
    date: Joi.string().required(),
    time: Joi.string().required(),
    timeDuration: Joi.number().positive(),
    net: Joi.number().integer().min(0).max(1),
    county: Joi.string().max(4).required(),
    district: Joi.string().max(6).required(),
    placeDescription: Joi.string().max(20),
    court: Joi.number().max(1),
    money: Joi.number().integer().min(0).max(65535),
    level: Joi.number().integer().min(0).max(4),
    levelDescription: Joi.string().min(1).max(255),
    peopleHave: Joi.number().integer().min(1).max(255),
    peopleNeed: Joi.number().integer().min(1).max(255),
    groupDescription: Joi.string().max(255)
  });

  const result = schema.validate(info);

  if (result.error) {
    res.status(400).json({ error: 'Input error' });
  } else {
    next();
  }
};

module.exports = {
  wrapAsync,
  auth,
  injectionCheck,
  inputCheck
};
