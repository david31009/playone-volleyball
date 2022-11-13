require('dotenv').config();
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
  const [result] = await pool.execute(
    'INSERT INTO `user` (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashPassword]
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

  // 回給前端
  const userInfo = {
    userId,
    username,
    email,
    jwtToken
  };

  return userInfo;
};

const signin = async (email, password) => {
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

module.exports = { signup, signin };
