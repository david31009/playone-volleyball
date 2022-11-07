const { pool } = require('./mysqlcon');

const createGroup = async (groupInfo) => {
  const [result] = await pool.execute(
    'INSERT INTO `group` (creator_id, title, date, time_duration, net, place, place_description, court, is_charge, money, level, level_description, people_have, people_need, people_left, group_description, is_build) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    groupInfo
  );
  return result.insertId;
};

const getGroups = async () => {
  const datenow = new Date(+new Date() + 8 * 3600 * 1000).toISOString();
  const [result] = await pool.execute(
    // 按最新的團、剩餘名額多排序 (取 10 筆)、已關團或時間過期者不從 DB 撈取
    'SELECT * FROM (SELECT group.id, title, date, time_duration, net, place, place_description, money, level, people_have, people_need, people_left, username, IF (`date` > ?, date, "expired") AS grp1, IF (`is_build` = 1, is_build, "closed") AS grp2 FROM `group` INNER JOIN `user` ON group.creator_id = user.id) AS T WHERE `grp1` != "expired" AND `grp2` != "closed" ORDER BY date DESC, people_left DESC LIMIT 10',
    [datenow]
  );
  return result;
};

const filterGroups = async (filterInfo) => {
  const datenow = new Date(+new Date() + 8 * 3600 * 1000).toISOString();
  filterInfo.unshift(datenow);
  const [result] = await pool.execute(
    // 加入篩選條件，按最新的團、剩餘名額最多排序 (取 10 筆)、已關團或時間過期者不從 DB 撈取
    'SELECT * FROM (SELECT group.id, title, date, time_duration, net, place, place_description, court, is_charge, money, level, people_have, people_need, people_left, username, IF (`date` > ?, date, "expired") AS grp1, IF (`is_build` = 1, is_build, "closed") AS grp2 FROM `group` INNER JOIN `user` ON group.creator_id = user.id) AS T WHERE `grp1` != "expired" AND `grp2` != "closed" AND place LIKE ? AND place LIKE ? AND level LIKE ? AND net LIKE ? AND court LIKE ? AND is_charge LIKE ? ORDER BY date DESC, people_left DESC LIMIT 10',
    filterInfo
  );
  console.log(result);

  return result;
};

const groupDetails = async (groupId) => {
  const [result] = await pool.execute(
    // 取出某團詳細資料
    'SELECT group.id, creator_id, username, title, date, time_duration, net, place, place_description, court, is_charge, money, group.level, level_description, people_have, people_need, people_left, group_description, is_build FROM `group` INNER JOIN `user` ON group.creator_id = user.id WHERE group.id = ?',
    groupId
  );
  return result;
};

const updateGroup = async (updateInfo) => {
  await pool.execute(
    'UPDATE `group` SET title = ?, date = ?, time_duration = ?, net = ?, place = ?, place_description = ?, court = ?, is_charge = ?, money = ?, level = ?, level_description = ?, people_have = ?, people_need = ?, group_description= ? WHERE id = ?',
    updateInfo
  );
};

const signupGroup = async (signupInfo) => {
  const conn = await pool.getConnection();
  groupId = [signupInfo[1]];
  //報名時，剩餘報名名額會少一位
  try {
    await conn.execute(
      'INSERT INTO `member` (user_id, group_id, signup_status) VALUES (?,?,?)',
      signupInfo
    );
    await conn.execute(
      'UPDATE `group` SET people_left = people_left - 1 WHERE id = ? and people_left > 0',
      groupId
    );
    await conn.execute('COMMIT');
    return true;
  } catch (error) {
    await conn.execute('ROLLBACK');
    console.log(error);
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

const createMsg = async (msgInfo) => {
  await pool.execute(
    'INSERT INTO `msg_board`(user_id, group_id, content, time) VALUES (?, ?, ?, ?)',
    msgInfo
  );
  return true;
};

const getMsg = async (groupId) => {
  const [result] = await pool.execute(
    'SELECT user_id, group_id, content, time, username FROM `msg_board` INNER JOIN `user` ON msg_board.user_id = user.id WHERE group_id = ? ORDER BY time DESC',
    groupId
  );
  return result;
};

const getSignupMembers = async (groupId) => {
  const [result] = await pool.execute(
    'SELECT user_id, username, signup_status FROM `member` INNER JOIN `user` ON member.user_id = user.id WHERE group_id = ?',
    groupId
  );
  return result;
};

const decideSignupStatus = async (updateInfo) => {
  const conn = await pool.getConnection();
  const userId = updateInfo[0];
  const groupId = updateInfo[1];
  const statusCode = updateInfo[2];
  const peopleLeft = updateInfo[3];
  try {
    await conn.execute(
      'UPDATE `member` SET signup_status = ? WHERE user_id = ? ',
      [statusCode, userId]
    );
    await conn.execute(
      'UPDATE `group` SET people_left = people_left + ? WHERE id = ? and people_left < people_need',
      [peopleLeft, groupId]
    );
    await conn.execute('COMMIT');
    return true;
  } catch (error) {
    await conn.execute('ROLLBACK');
    console.log(error);
  } finally {
    await conn.release();
  }
};

const closeGroup = async (groupId) => {
  await pool.execute('UPDATE `group` SET is_build = 0 WHERE id = ? ', groupId);
};

module.exports = {
  createGroup,
  getGroups,
  filterGroups,
  groupDetails,
  updateGroup,
  signupGroup,
  getSignupStatus,
  createMsg,
  getMsg,
  getSignupMembers,
  decideSignupStatus,
  closeGroup,
};
