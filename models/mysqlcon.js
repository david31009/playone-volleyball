const mysql = require('mysql2/promise');

const options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // 無可用連線時是否等待pool連線釋放 (預設為 true)
  waitForConnections: true,
  // 連線池可建立的總連線數上限 (預設最多為 10 個連線數)
  connectionLimit: 10,
};

const pool = mysql.createPool(options);

module.exports = { pool, mysql };
