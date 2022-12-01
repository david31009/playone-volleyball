// Express Initialization
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const { PORT, API_VERSION } = process.env;

// redis 連線
const Cache = require('./utils/cache');

// CORS allow all
app.use(cors());

// get user ip
app.set('trust proxy', true);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use(`/api/${API_VERSION}`, [
  require('./routes/group_route'),
  require('./routes/profile_route'),
  require('./routes/user_route')
]);

// Error handling
app.use(function (err, req, res, next) {
  // 接系統的錯誤，不讓 server crash
  console.log(err);
  res.status(500).send('Internal Server Error');
});

// set port to 3000
// redis 連線
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Connecting to redis...');
  Cache.connect().catch(() => {
    console.log('Error in Redis');
  });
});
