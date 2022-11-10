require('dotenv').config({ path: '../.env' });
const { pool } = require('../models/mysqlcon');

const createTable = async () => {
  try {
    // 刪表和建表順序要對
    await pool.execute('DROP TABLE IF EXISTS `chat_msg`;');
    await pool.execute('DROP TABLE IF EXISTS `user_chatroom`;');
    await pool.execute('DROP TABLE IF EXISTS `chatroom`;');
    await pool.execute('DROP TABLE IF EXISTS `fans`;');
    await pool.execute('DROP TABLE IF EXISTS `msg_board`;');
    await pool.execute('DROP TABLE IF EXISTS `comment`;');
    await pool.execute('DROP TABLE IF EXISTS `member`;');
    await pool.execute('DROP TABLE IF EXISTS `group`;');
    await pool.execute('DROP TABLE IF EXISTS `user`;');
    console.log('Drop existed table');

    await pool.execute(
      'CREATE TABLE `user`(`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, `username` VARCHAR(20), `email` VARCHAR(45), `password` VARCHAR(45), `gender` CHAR(1), `intro` VARCHAR(255), `county` CHAR(3), `my_level` CHAR(1), `my_level_description` VARCHAR(45), `fans` INT UNSIGNED DEFAULT 0, `follow` INT UNSIGNED DEFAULT 0, `position_1` CHAR(1), `position_2` CHAR(1), `confirm_status` CHAR(1), `confirm_code` VARCHAR(20), PRIMARY KEY (`id`))'
    );
    await pool.execute(
      'CREATE TABLE `group`(`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, `creator_id` INT UNSIGNED, `title` VARCHAR(45), `date` DATETIME, `time_duration` SMALLINT UNSIGNED, `net` CHAR(1), `place` VARCHAR(10), `place_description` VARCHAR(20), `court` CHAR(1), `is_charge` BOOLEAN, `money` SMALLINT UNSIGNED, `level` CHAR(1), `level_description` VARCHAR(255), `people_have` TINYINT UNSIGNED, `people_need` TINYINT UNSIGNED, `people_left` TINYINT UNSIGNED, `group_description` VARCHAR(255), `is_build` BOOLEAN, PRIMARY KEY (`id`), FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE CASCADE)'
    );
    await pool.execute(
      'CREATE TABLE `member`(`user_id` INT UNSIGNED, `group_id` INT UNSIGNED, `signup_status` CHAR(1), PRIMARY KEY (`user_id`, `group_id`), FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE, FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE)'
    );
    await pool.execute(
      'CREATE TABLE `comment`(`user_id` INT UNSIGNED, `commenter_id` INT UNSIGNED, `group_id` INT UNSIGNED, `score` TINYINT UNSIGNED, `content` VARCHAR(45), `date` DATETIME, PRIMARY KEY (`commenter_id`, `group_id`), FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE, FOREIGN KEY (`commenter_id`) REFERENCES `user` (`id`) ON DELETE CASCADE, FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE)'
    );
    await pool.execute(
      'CREATE TABLE `msg_board`(`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, `user_id` INT UNSIGNED, `group_id` INT UNSIGNED, `content` VARCHAR(45), `time` DATETIME, PRIMARY KEY (`id`), FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE, FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE)'
    );
    await pool.execute(
      'CREATE TABLE `fans`(`user_id` INT UNSIGNED, `follow_id` INT UNSIGNED, PRIMARY KEY (`user_id`, `follow_id`), FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE, FOREIGN KEY (`follow_id`) REFERENCES `user` (`id`) ON DELETE CASCADE)'
    );
    await pool.execute(
      'CREATE TABLE `chatroom`(`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, `name` VARCHAR(20), PRIMARY KEY (`id`))'
    );
    await pool.execute(
      'CREATE TABLE `user_chatroom`(`user_id` INT UNSIGNED, `chatroom_id` INT UNSIGNED, PRIMARY KEY (`user_id`, `chatroom_id`), FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE, FOREIGN KEY (`chatroom_id`) REFERENCES `chatroom` (`id`) ON DELETE CASCADE)'
    );
    await pool.execute(
      'CREATE TABLE `chat_msg`(`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, `user_id` INT UNSIGNED, `chatroom_id` INT UNSIGNED, `msg` VARCHAR(45), `time` DATETIME, PRIMARY KEY (`id`), FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE, FOREIGN KEY (`chatroom_id`) REFERENCES `chatroom` (`id`) ON DELETE CASCADE)'
    );
    console.log('table created successfully.');
    process.exit();
  } catch (err) {
    console.error(err);
    console.error('create table failed');
  }
};

createTable();
