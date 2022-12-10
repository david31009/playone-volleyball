const { pool } = require('./mysqlcon');

const commentTitle = async (groupId) => {
  const [result] = await pool.execute(
    'SELECT id, title, date FROM `group` WHERE id = ?',
    groupId
  );
  return result;
};

const getCommentStatus = async (comment) => {
  const [result] = await pool.execute(
    'SELECT * FROM `comment` WHERE commenter_id = ? AND group_id = ?',
    comment
  );
  return result;
};

const sendComment = async (comment) => {
  await pool.execute(
    'INSERT INTO `comment` (user_id, commenter_id, group_id, score, content, date) VALUES (?, ?, ?, ?, ?, ?)',
    comment
  );
};

const getComments = async (userId) => {
  const [result] = await pool.execute(
    'SELECT user_id, commenter_id, group_id, score, content, comment.date, title, username FROM `comment` INNER JOIN `user` ON comment.commenter_id = user.id INNER JOIN `group` ON comment.group_id = group.id WHERE user_id = ? ORDER BY date DESC',
    userId
  );
  return result;
};

module.exports = {
  commentTitle,
  getCommentStatus,
  sendComment,
  getComments
};
