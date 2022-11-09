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

module.exports = { updateUser, userProfile, follow, followStatus, unfollow };
