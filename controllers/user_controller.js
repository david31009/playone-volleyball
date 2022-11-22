const validator = require('validator');
const User = require('../models/user_model');

const signup = async (req, res) => {
  const { username } = req.body;
  const { email, password } = req.body;

  // 檢查 username, email, password 有無填寫
  if (!username || !email || !password) {
    res.status(400).send({ error: 'name, email and password are required.' });
    return;
  }

  // 檢查 email 格式是否正確
  if (!validator.isEmail(email)) {
    res.status(400).send({ error: 'Invalid email format' });
    return;
  }

  // 檢查密碼強度
  const pwdCheck = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  };
  const strongPwd = validator.isStrongPassword(password, pwdCheck);
  if (!strongPwd) {
    res.status(400).send({ error: 'Weak Password' });
    return;
  }

  // 存進 DB
  const result = await User.signup(username, email, password);
  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }

  res.status(200).json({ result });
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  // 檢查 email, password 有無填寫
  if (!email || !password) {
    res.status(400).send({ error: 'email and password are required.' });
    return;
  }

  // 檢查 email 格式是否正確
  if (!validator.isEmail(email)) {
    res.status(400).send({ error: 'Invalid email format' });
    return;
  }

  const result = await User.signin(email, password);
  // 密碼錯誤
  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }
  res.status(200).json({ result });
};

const profile = async (req, res) => {
  const { user } = req;
  res.status(200).send({ userId: user.userId });
};

const loginCheck = async (req, res) => {
  res.status(200).send('ok');
};

module.exports = { signup, signin, profile, loginCheck };
