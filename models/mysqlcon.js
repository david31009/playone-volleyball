require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');

const options = process.env.NODE_ENV || 'production';
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_DATABASE_TEST } = process.env;

const mysqlConfig = {
  production: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
  },
  development: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
  },
  test: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE_TEST
  }
};

const mysqlOptions = mysqlConfig[options];
mysqlOptions.dateStrings = true; // 存時間進去會以 string 儲存，而非 object
mysqlOptions.waitForConnections = true; // 無可用連線時是否等待pool連線釋放 (預設為 true)
mysqlOptions.connectionLimit = 20; // 連線池可建立的總連線數上限 (預設最多為 10 個連線數)

const pool = mysql.createPool(mysqlOptions);

module.exports = { pool, mysql };
