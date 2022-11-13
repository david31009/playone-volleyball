const moment = require('moment');
const { pool } = require('./mysqlcon');

const updateUser = async (userInfo) => {
  await pool.execute(
    'UPDATE `user` SET username = ?, gender = ?, county = ?, position_1 = ?, position_2 = ?, my_level = ?, my_level_description = ?, intro = ? WHERE id = ?',
    userInfo
  );
};

const userProfile = async (userId) => {
  const [result] = await pool.execute(
    'SELECT username, gender, intro, county, my_level, my_level_description, fans, follow, position_1, position_2 FROM `user` WHERE id = ?',
    userId
  );
  return result;
};

const follow = async (followInfo) => {
  const userId = followInfo[0];
  const followId = followInfo[1];
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');
    await conn.execute(
      'INSERT INTO `fans` (user_id, follow_id) VALUES (?, ?)',
      followInfo
    );
    await conn.execute('UPDATE `user` SET follow = follow + 1 WHERE id = ?', [
      userId,
    ]);
    await conn.execute('UPDATE `user` SET fans = fans + 1 WHERE id = ?', [
      followId,
    ]);
    await conn.query('COMMIT');
    return true;
  } catch (error) {
    await conn.query('ROLLBACK');
    console.log(error);
  } finally {
    await conn.release();
  }
};

const followStatus = async (info) => {
  const [result] = await pool.execute(
    'SELECT * FROM `fans` WHERE user_id = ? AND follow_id = ?',
    info
  );
  return result;
};

const unfollow = async (followInfo) => {
  const userId = followInfo[0];
  const followId = followInfo[1];
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');
    await conn.execute(
      'DELETE FROM `fans` WHERE user_id = ? AND follow_id = ?',
      followInfo
    );
    await conn.execute('UPDATE `user` SET follow = follow - 1 WHERE id = ?', [
      userId,
    ]);
    await conn.execute('UPDATE `user` SET fans = fans - 1 WHERE id = ?', [
      followId,
    ]);
    await conn.query('COMMIT');
    return true;
  } catch (error) {
    await conn.query('ROLLBACK');
    console.log(error);
  } finally {
    await conn.release();
  }
};

const nowCreate = async (userId) => {
  const datenow = moment().format('YYYY-MM-DD HH:mm:ss');
  const [result] = await pool.execute(
    'SELECT * FROM (SELECT id, title, date, is_build, IF (`date` > ?, date, "expired") AS grp1, IF (`is_build` = 1, is_build, "closed") AS grp2 FROM `group` WHERE creator_id = ?) AS T WHERE `grp1` != "expired" AND `grp2` = 1 ORDER BY date DESC',
    [datenow, userId]
  );
  return result;
};

const pastCreate = async (userId) => {
  const datenow = moment().format('YYYY-MM-DD HH:mm:ss');
  const [result] = await pool.execute(
    'SELECT * FROM (SELECT id, title, date, is_build, IF (`date` > ?, date, "expired") AS grp1, IF (`is_build` = 1, is_build, "closed") AS grp2 FROM `group` WHERE creator_id = ?) AS T WHERE `grp1` = "expired" OR `grp2` = "closed" ORDER BY date DESC',
    [datenow, userId]
  );
  return result;
};

const nowSignup = async (userId) => {
  // 有報名 and 未關團 and 未過期)
  const datenow = moment().format('YYYY-MM-DD HH:mm:ss');
  const [result] = await pool.execute(
    'SELECT * FROM (SELECT user_id, group_id, signup_status, title, date, is_build, IF (`date` > ?, date, "expired") AS grp1, IF (`is_build` = 1, is_build, "closed") AS grp2 FROM `member` INNER JOIN `group` ON member.group_id = group.id WHERE user_id = ?) AS T WHERE `grp1` != "expired" AND `grp2` != "closed" ORDER BY date DESC',
    [datenow, userId]
  );
  return result;
};

const pastSignup = async (userId) => {
  // 報名成功且 (已關團 或 已過期)
  const datenow = moment().format('YYYY-MM-DD HH:mm:ss');
  const [result] = await pool.execute(
    'SELECT * FROM (SELECT user_id, group_id, signup_status, title, creator_id, date, is_build, IF (`date` > ?, date, "expired") AS grp1, IF (`is_build` = 1, is_build, "closed") AS grp2 FROM `member` INNER JOIN `group` ON member.group_id = group.id WHERE user_id = ? AND signup_status = 1) AS T WHERE `grp1` = "expired" OR `grp2` = "closed" ORDER BY date DESC',
    [datenow, userId]
  );
  return result;
};

const groupInfo = async (groupId) => {
  const [result] = await pool.execute(
    'SELECT id, title, date FROM `group` WHERE id = ?',
    groupId
  );
  return result;
};

const storeComment = async (comment) => {
  await pool.execute(
    'INSERT INTO `comment` (user_id, commenter_id, group_id, score, content, date) VALUES (?, ?, ?, ?, ?, ?)',
    comment
  );
};

const commentStatus = async (comment) => {
  const [result] = await pool.execute(
    'SELECT * FROM `comment` WHERE commenter_id = ? AND group_id = ?',
    comment
  );
  return result;
};

const getComments = async (userId) => {
  const [result] = await pool.execute(
    'SELECT user_id, commenter_id, group_id, score, content, comment.date, title, username FROM `comment` INNER JOIN `user` ON comment.commenter_id = user.id INNER JOIN `group` ON comment.group_id = group.id WHERE user_id = ?',
    userId
  );
  // console.log(result);
  return result;
};

module.exports = {
  updateUser,
  userProfile,
  follow,
  followStatus,
  unfollow,
  nowCreate,
  pastCreate,
  nowSignup,
  pastSignup,
  groupInfo,
  storeComment,
  commentStatus,
  getComments,
};
