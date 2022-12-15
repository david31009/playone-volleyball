#!/usr/bin/env node

require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcrypt');
const Cache = require('./cache');
const { pool } = require('../models/mysqlcon');
const { users, groups, members, comments, messages, fans } = require('./fake_data');

const salt = parseInt(process.env.BCRYPT_SALT, 10);

const clearCache = async () => {
  await Cache.connect().catch(() => {
    console.log('Error in Redis');
  });
  if (Cache.ready === true) {
    const keys = await Cache.keys('group-*');

    for (let i = 0; i < keys.length; i++) {
      // 可以不用 await (沒有回傳值)
      Cache.del(keys[i]);
    }
  }
  await Cache.quit();
};

// 建資料進 DB
async function createFakeUser(conn) {
  const encryped_users = users.map((user) => {
    const encryped_user = {
      id: user.id,
      provider: user.provider,
      username: user.username,
      email: user.email,
      password: bcrypt.hashSync(user.password, salt),
      gender: user.gender,
      intro: user.intro,
      county: user.county,
      my_level: user.my_level,
      my_level_description: user.my_level_description,
      fans: user.fans,
      follow: user.follow,
      position_1: user.position_1,
      position_2: user.position_2
    };
    return encryped_user;
  });

  // 插入多列，只有 query 適用
  return await conn.query(
    'INSERT INTO user (id, provider, username, email, password, gender, intro, county, my_level, my_level_description, fans, follow, position_1, position_2) VALUES ?',
    [encryped_users.map((x) => Object.values(x))]
  );
}
async function createFakeGroup(conn) {
  return await conn.query(
    'INSERT INTO `group` (creator_id, title, date, time_duration, net, place, place_description, court, is_charge, money, level, level_description, people_have, people_need, people_left, group_description, is_build) VALUES ?',
    [groups.map((x) => Object.values(x))]
  );
}

async function createFakeMember(conn) {
  return await conn.query('INSERT INTO `member` (user_id, group_id, signup_status) VALUES ?', [
    members.map((x) => Object.values(x))
  ]);
}

async function createFakeComment(conn) {
  return await conn.query(
    'INSERT INTO `comment` (user_id, commenter_id, group_id, score, content, date) VALUES ?',
    [comments.map((x) => Object.values(x))]
  );
}

async function createFakeMsg(conn) {
  return await conn.query('INSERT INTO `msg_board` (user_id, group_id, content, time) VALUES ?', [
    messages.map((x) => Object.values(x))
  ]);
}

async function createFakeFan(conn) {
  return await conn.query('INSERT INTO `fans` (user_id, follow_id) VALUES ?', [
    fans.map((x) => Object.values(x))
  ]);
}

// 執行
async function createFakeData() {
  // 建假資料
  const conn = await pool.getConnection();
  await conn.query('START TRANSACTION');
  await createFakeUser(conn);
  await createFakeGroup(conn);
  await createFakeMember(conn);
  await createFakeComment(conn);
  await createFakeMsg(conn);
  await createFakeFan(conn);
  await conn.execute('COMMIT');
  await conn.release();
}

async function closeConnection() {
  return await pool.end();
}

async function main() {
  await clearCache();
  await createFakeData();
  await closeConnection();
}

// execute when called directly.
if (require.main === module) {
  main();
}
