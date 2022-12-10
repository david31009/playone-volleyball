const moment = require('moment');
const { pool } = require('./mysqlcon');

const datenow = moment().format('YYYY-MM-DD HH:mm:ss');

const allPage = async () => {
  // 總頁數
  let [[totalRecords]] = await pool.execute(
    'SELECT COUNT(*) FROM (SELECT group.id, title, date, time_duration, net, place, place_description, money, level, people_have, people_need, people_left, username, IF (`date` > ?, date, "expired") AS grp1, IF (`is_build` = 1, is_build, "closed") AS grp2 FROM `group` INNER JOIN `user` ON group.creator_id = user.id) AS T WHERE `grp1` != "expired" AND `grp2` != "closed"',
    [datenow]
  );
  totalRecords = totalRecords['COUNT(*)'];
  return { totalRecords };
};

const nextPage = async (startRecord, pageSize) => {
  const [GroupsPerPage] = await pool.execute(
    'SELECT * FROM (SELECT group.id, title, date, time_duration, net, place, place_description, money, level, people_have, people_need, people_left, username, IF (`date` > ?, date, "expired") AS grp1, IF (`is_build` = 1, is_build, "closed") AS grp2 FROM `group` INNER JOIN `user` ON group.creator_id = user.id) AS T WHERE `grp1` != "expired" AND `grp2` != "closed" ORDER BY date ASC LIMIT ?, ?',
    [datenow, startRecord, pageSize]
  );
  return GroupsPerPage;
};

module.exports = {
  nextPage,
  allPage
};
