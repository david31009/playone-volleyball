const moment = require('moment');
const { pool } = require('./mysqlcon');

const datenow = moment().format('YYYY-MM-DD HH:mm:ss');

const getGroups = async () => {
  const [groups] = await pool.execute(
    // 按最舊的團、已關團或時間過期者不從 DB 撈取
    'SELECT * FROM (SELECT group.id, title, date, time_duration, net, place, place_description, money, level, people_have, people_need, people_left, username, IF (`date` > ?, date, "expired") AS grp1, IF (`is_build` = 1, is_build, "closed") AS grp2 FROM `group` INNER JOIN `user` ON creator_id = user.id) AS T WHERE `grp1` != "expired" AND `grp2` != "closed" ORDER BY date ASC LIMIT 10',
    [datenow]
  );

  return groups;
};
const createGroup = async (groupInfo, creatorId) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');
    // 建立揪團
    const [result] = await conn.execute(
      'INSERT INTO `group` (creator_id, title, date, time_duration, net, place, place_description, court, is_charge, money, level, level_description, people_have, people_need, people_left, group_description, is_build) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      groupInfo
    );

    // 撈主揪的粉絲資料
    const [fans] = await conn.execute(
      'SELECT user_id, username, email FROM `fans` INNER JOIN `user` ON user_id = user.id WHERE follow_id = ?',
      [creatorId]
    );
    await conn.execute('COMMIT');
    return { groupId: result.insertId, fans };
  } catch (error) {
    await conn.execute('ROLLBACK');
    console.log(error);
  } finally {
    await conn.release();
  }
};

const filterGroups = async (
  county,
  district,
  groupLevel,
  net,
  court,
  isCharge,
  page
) => {
  const [groups] = await pool.execute(
    // 加入篩選條件，按最舊的團 (取 10 筆)、已關團或時間過期者不從 DB 撈取
    'SELECT * FROM (SELECT group.id, title, date, time_duration, net, place, place_description, court, is_charge, money, level, people_have, people_need, people_left, username, IF (`date` > ?, date, "expired") AS grp1, IF (`is_build` = 1, is_build, "closed") AS grp2 FROM `group` INNER JOIN `user` ON group.creator_id = user.id) AS T WHERE `grp1` != "expired" AND `grp2` != "closed" AND place LIKE ? AND place LIKE ? AND level LIKE ? AND net LIKE ? AND court LIKE ? AND is_charge LIKE ? ORDER BY date ASC LIMIT ?, 10',
    [datenow, county, district, groupLevel, net, court, isCharge, page]
  );

  // 總頁數
  let [[totalRecords]] = await pool.execute(
    'SELECT COUNT(*) FROM (SELECT group.id, title, date, time_duration, net, place, place_description, court, is_charge, money, level, people_have, people_need, people_left, username, IF (`date` > ?, date, "expired") AS grp1, IF (`is_build` = 1, is_build, "closed") AS grp2 FROM `group` INNER JOIN `user` ON group.creator_id = user.id) AS T WHERE `grp1` != "expired" AND `grp2` != "closed" AND place LIKE ? AND place LIKE ? AND level LIKE ? AND net LIKE ? AND court LIKE ? AND is_charge LIKE ?',
    [datenow, county, district, groupLevel, net, court, isCharge]
  );
  totalRecords = totalRecords['COUNT(*)'];
  return { groups, totalRecords };
};

const updateGroup = async (updateInfo) => {
  await pool.execute(
    'UPDATE `group` SET title = ?, date = ?, time_duration = ?, net = ?, place = ?, place_description = ?, court = ?, is_charge = ?, money = ?, level = ?, level_description = ?, people_have = ?, people_need = ?, people_left = ?, group_description= ? WHERE id = ?',
    updateInfo
  );
};

const closeGroup = async (groupId) => {
  await pool.execute('UPDATE `group` SET is_build = 0 WHERE id = ? ', groupId);
};

const groupDetails = async (groupId) => {
  const [result] = await pool.execute(
    // 取出某團詳細資料
    'SELECT group.id, creator_id, username, title, date, time_duration, net, place, place_description, court, is_charge, money, group.level, level_description, people_have, people_need, people_left, group_description, is_build FROM `group` INNER JOIN `user` ON group.creator_id = user.id WHERE group.id = ?',
    groupId
  );
  return result;
};

module.exports = {
  createGroup,
  getGroups,
  filterGroups,
  groupDetails,
  updateGroup,
  closeGroup
};
