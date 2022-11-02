const { pool } = require('./mysqlcon');

const createGroup = async (groupInfo) => {
  const [result] = await pool.execute(
    'INSERT INTO `group` (creator_id, title, date, time_duration, net, place, place_description, court, money, level, level_description, people_have, people_need, people_left, group_description, is_build) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    groupInfo
  );
  return result.insertId;
};

const getCards = async () => {
  const [result] = await pool.execute(
    // 按最新的團、剩餘名額最多排序 (取 10 筆)
    'SELECT group.id, title, date, time_duration, net, place, place_description, money, group.level, people_have, people_need, user.username FROM `group` INNER JOIN `user` ON group.creator_id = user.id ORDER BY group.date DESC, group.people_left ASC LIMIT 10'
  );
  return result;
};

module.exports = { createGroup, getCards };
