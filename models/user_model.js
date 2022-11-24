require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { pool } = require('./mysqlcon');

const salt = parseInt(process.env.BCRYPT_SALT, 10);

const signup = async (username, email, password) => {
  // 檢查 email 是否有重複
  const [emailCheck] = await pool.execute(
    'SELECT email FROM `user` WHERE email = ?',
    [email]
  );
  if (emailCheck.length > 0) {
    return {
      error: 'Email Already Exists'
    };
  }

  // 存進 DB
  const hashPassword = bcrypt.hashSync(password, salt);
  const provider = 'native';
  const [result] = await pool.execute(
    'INSERT INTO `user` (provider, username, email, password) VALUES (?, ?, ?, ?)',
    [provider, username, email, hashPassword]
  );
  const userId = result.insertId;

  // 產生 jwt token
  const jwtToken = jwt.sign(
    {
      userId,
      username,
      email
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: '1 day'
    }
  );

  return { userId, username, email, jwtToken };
};

const nativeSignin = async (email, password) => {
  const [[user]] = await pool.execute('SELECT * FROM `user` WHERE email = ?', [
    email
  ]);

  // 信箱不存在
  if (!user) {
    return { error: 'Signin failed' };
  }

  // 密碼錯誤
  if (!bcrypt.compareSync(password, user.password)) {
    return { error: 'Signin failed' };
  }

  // 產生新的 jwt token
  const jwtToken = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: '1 day'
    }
  );

  // 回給前端
  const userInfo = {
    userId: user.id,
    username: user.username,
    email: user.email,
    jwtToken
  };

  return userInfo;
};

const facebookSignin = async (id, username, email) => {
  // 檢查 email 是否存在
  const [emailCheck] = await pool.execute(
    'SELECT id, username, email FROM `user` WHERE email = ?',
    [email]
  );

  let jwtToken;
  let userId;
  // 存在更新 jwt token
  if (emailCheck.length > 0) {
    userId = emailCheck[0].id;
    jwtToken = jwt.sign(
      {
        userId,
        username: emailCheck[0].username,
        email: emailCheck[0].email
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '1 day'
      }
    );
  } else {
    // 不存在，存入 DB
    const provider = 'facebook';
    const [result] = await pool.execute(
      'INSERT INTO `user` (provider, username, email) VALUES (?, ?, ?)',
      [provider, username, email]
    );

    // 產生 jwt token
    userId = result.insertId;
    jwtToken = jwt.sign(
      {
        userId,
        username,
        email
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '1 day'
      }
    );
  }

  return { userId, username, email, jwtToken };
};

const getFacebookProfile = async (accessToken) => {
  const userInfo = await axios.get(
    // 從後端向 fb server 確認 token 並取得使用者資訊
    `https://graph.facebook.com/v15.0/me?fields=id%2Cname%2Cemail&access_token=${accessToken}`
  );

  return userInfo.data;
};

module.exports = { signup, nativeSignin, facebookSignin, getFacebookProfile };
