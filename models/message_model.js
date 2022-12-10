const { pool } = require('./mysqlcon');

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

module.exports = {
  createMsg,
  getMsg
};
