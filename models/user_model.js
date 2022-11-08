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

module.exports = { updateUser, userProfile };
