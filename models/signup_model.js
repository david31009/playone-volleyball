const { pool } = require('./mysqlcon');

const getSignupMembers = async (groupId) => {
  const [result] = await pool.execute(
    'SELECT user_id, username, group_id, signup_status FROM `member` INNER JOIN `user` ON member.user_id = user.id WHERE group_id = ?',
    groupId
  );
  return result;
};
const signupGroup = async (signupInfo) => {
  const conn = await pool.getConnection();
  const groupId = [signupInfo[1]];
  // 報名時，剩餘報名名額會少一位
  try {
    await conn.query('START TRANSACTION');
    await conn.execute(
      'INSERT INTO `member` (user_id, group_id, signup_status) VALUES (?,?,?)',
      signupInfo
    );
    await conn.execute(
      'UPDATE `group` SET people_left = people_left - 1 WHERE id = ? and people_left > 0',
      groupId
    );

    // 回傳 creator username, creator email
    const [result] = await conn.execute(
      'SELECT username, email FROM `group` INNER JOIN `user` ON creator_id = user.id WHERE group.id = ?',
      groupId
    );

    await conn.execute('COMMIT');
    return result;
  } catch (error) {
    await conn.execute('ROLLBACK');
    console.log(error); // FIXME: 用 throw error 讓 wrap async 去接，才能回給前端
  } finally {
    await conn.release();
  }
};

const getSignupStatus = async (memberInfo) => {
  const [result] = await pool.execute(
    'SELECT * FROM `member` WHERE user_id = ? AND group_id = ?',
    memberInfo
  );
  return result;
};

const updateSignupStatus = async (updateInfo) => {
  const conn = await pool.getConnection();
  const userId = updateInfo[0];
  const groupId = updateInfo[1];
  const statusCode = updateInfo[2];
  const peopleLeft = updateInfo[3];

  try {
    await conn.query('START TRANSACTION');
    await conn.execute(
      'UPDATE `member` SET signup_status = ? WHERE user_id = ? AND group_id = ?',
      [statusCode, userId, groupId]
    );
    await conn.execute(
      'UPDATE `group` SET people_left = people_left + ? WHERE id = ? and people_left < people_need',
      [peopleLeft, groupId]
    );
    // 回傳 user username, user email
    const [result] = await conn.execute(
      'SELECT username, email, group_id, signup_status FROM `user` INNER JOIN `member` ON user.id = user_id WHERE id = ? AND group_id = ?',
      [userId, groupId]
    );
    await conn.query('COMMIT');
    return result;
  } catch (error) {
    await conn.query('ROLLBACK');
    console.log(error);
  } finally {
    await conn.release();
  }
};

module.exports = {
  getSignupMembers,
  signupGroup,
  getSignupStatus,
  updateSignupStatus
};
