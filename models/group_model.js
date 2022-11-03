const { pool } = require('./mysqlcon');

const createGroup = async (groupInfo) => {
  const [result] = await pool.execute(
    'INSERT INTO `group` (creator_id, title, date, time_duration, net, place, place_description, court, is_charge, money, level, level_description, people_have, people_need, people_left, group_description, is_build) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    groupInfo
  );
  return result.insertId;
};

const getGroups = async () => {
  const [result] = await pool.execute(
    // 按最新的團、剩餘名額最多排序 (取 10 筆)
    'SELECT group.id, title, date, time_duration, net, place, place_description, money, group.level, people_have, people_need, user.username FROM `group` INNER JOIN `user` ON group.creator_id = user.id ORDER BY group.date DESC, group.people_left ASC LIMIT 10'
  );
  return result;
};

const filterGroups = async (filterInfo) => {
  const [result] = await pool.execute(
    // 加入篩選條件，按最新的團、剩餘名額最多排序 (取 10 筆)
    'SELECT group.id, title, date, time_duration, net, place, place_description, money, group.level, people_have, people_need, user.username FROM `group` INNER JOIN `user` ON group.creator_id = user.id WHERE place LIKE ? AND place LIKE ? AND group.level LIKE ? AND net LIKE ? AND court LIKE ? AND is_charge LIKE ? ORDER BY group.date DESC, group.people_left ASC LIMIT 10',
    filterInfo
  );
  return result;
};

const groupDetails = async (groupId) => {
  const [result] = await pool.execute(
    // 取出某團詳細資料
    'SELECT * FROM `group` INNER JOIN `user` ON group.creator_id = user.id WHERE group.id = ?',
    groupId
  );
  return result;
};

module.exports = { createGroup, getGroups, filterGroups, groupDetails };
