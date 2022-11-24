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

const nativeSignin = async (email, password) => {
  // 檢查 email, password 有無填寫
  if (!email || !password) {
    return { error: 'email and password are required.' };
  }

  // 檢查 email 格式是否正確
  if (!validator.isEmail(email)) {
    return { error: 'Invalid email format' };
  }

  const result = await User.nativeSignin(email, password);

  // 密碼錯誤
  if (result.error) {
    return { error: result.error };
  }

  return result;
};

const facebookSignin = async (accessToken) => {
  if (!accessToken) {
    return { error: 'No facebook access token.' };
  }

  try {
    const profile = await User.getFacebookProfile(accessToken);
    const { id, name, email } = profile;

    if (!id || !name || !email) {
      return {
        error: 'facebook access token can not get user id, name or email'
      };
    }

    const result = await User.facebookSignin(id, name, email);

    return result;
  } catch (error) {
    return { error };
  }
};

const signin = async (req, res) => {
  const data = req.body;

  let result;
  switch (data.provider) {
    case 'native': // 原生登入
      result = await nativeSignin(data.email, data.password);
      break;
    case 'facebook': // fb登入
      result = await facebookSignin(data.accessToken);
      break;
    default:
      result = { error: 'Wrong Request' };
  }

  if (result.error) {
    res.status(400).json({ error: result.error });
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
