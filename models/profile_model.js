const { pool } = require('./mysqlcon');

const updateUserProfile = async (userInfo) => {
  await pool.execute(
    'UPDATE `user` SET username = ?, gender = ?, county = ?, position_1 = ?, position_2 = ?, my_level = ?, my_level_description = ?, intro = ? WHERE id = ?',
    userInfo
  );
};

const getUserProfile = async (userId) => {
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
      userId
    ]);
    await conn.execute('UPDATE `user` SET fans = fans + 1 WHERE id = ?', [
      followId
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
      userId
    ]);
    await conn.execute('UPDATE `user` SET fans = fans - 1 WHERE id = ?', [
      followId
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

const getFollowList = async (userId) => {
  const [result] = await pool.execute(
    'SELECT user_id, follow_id, user.id, username FROM `fans` INNER JOIN `user` ON fans.follow_id = user.id WHERE user_id = ?',
    userId
  );
  return result;
};

const getFansList = async (userId) => {
  const [result] = await pool.execute(
    'SELECT user_id, follow_id, user.id, username FROM `fans` INNER JOIN `user` ON fans.user_id = user.id WHERE follow_id = ?',
    userId
  );
  return result;
};

module.exports = {
  updateUserProfile,
  getUserProfile,
  follow,
  followStatus,
  unfollow,
  getFollowList,
  getFansList
};
