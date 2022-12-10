const moment = require('moment');
const { pool } = require('./mysqlcon');

const getCreateGroup = async (userId) => {
  const datenow = moment().format('YYYY-MM-DD HH:mm:ss');
  const [result] = await pool.execute(
    'SELECT * FROM (SELECT id, title, date, is_build, IF (`date` > ?, date, "expired") AS grp1, IF (`is_build` = 1, is_build, "closed") AS grp2 FROM `group` WHERE creator_id = ?) AS T WHERE `grp1` != "expired" AND `grp2` = 1 ORDER BY date ASC',
    [datenow, userId]
  );
  return result;
};

const getSignupGroup = async (userId) => {
  // 有報名 and 未關團 and 未過期)
  const datenow = moment().format('YYYY-MM-DD HH:mm:ss');
  const [result] = await pool.execute(
    'SELECT * FROM (SELECT user_id, group_id, signup_status, title, date, is_build, IF (`date` > ?, date, "expired") AS grp1, IF (`is_build` = 1, is_build, "closed") AS grp2 FROM `member` INNER JOIN `group` ON member.group_id = group.id WHERE user_id = ?) AS T WHERE `grp1` != "expired" AND `grp2` != "closed" ORDER BY date ASC',
    [datenow, userId]
  );
  return result;
};

const getPastCreateGroup = async (userId) => {
  const datenow = moment().format('YYYY-MM-DD HH:mm:ss');
  const [result] = await pool.execute(
    'SELECT * FROM (SELECT id, title, date, is_build, IF (`date` > ?, date, "expired") AS grp1, IF (`is_build` = 1, is_build, "closed") AS grp2 FROM `group` WHERE creator_id = ?) AS T WHERE `grp1` = "expired" OR `grp2` = "closed" ORDER BY date ASC',
    [datenow, userId]
  );
  return result;
};

const getPastSignupGroup = async (userId) => {
  // 報名成功且 (已關團 或 已過期)
  const datenow = moment().format('YYYY-MM-DD HH:mm:ss');
  const [result] = await pool.execute(
    'SELECT * FROM (SELECT user_id, group_id, signup_status, title, creator_id, date, is_build, IF (`date` > ?, date, "expired") AS grp1, IF (`is_build` = 1, is_build, "closed") AS grp2 FROM `member` INNER JOIN `group` ON member.group_id = group.id WHERE user_id = ? AND signup_status = 1) AS T WHERE `grp1` = "expired" OR `grp2` = "closed" ORDER BY date ASC',
    [datenow, userId]
  );
  return result;
};

module.exports = {
  getCreateGroup,
  getSignupGroup,
  getPastCreateGroup,
  getPastSignupGroup
};
