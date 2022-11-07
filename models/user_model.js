const { pool } = require('./mysqlcon');

const updateUser = async (userInfo) => {
  await pool.execute(
    'UPDATE `user` SET username = ?, gender = ?, county = ?, position_1 = ?, position_2 = ?, my_level = ?, my_level_description = ?, intro = ? WHERE id = ?',
    userInfo
  );
};

module.exports = { updateUser };
