// Express Initialization
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const { PORT, API_VERSION, IP } = process.env;

// redis 連線
const Cache = require('./utils/cache');
const { rateLimiterRoute } = require('./utils/ratelimiter');

// CORS allow specific region
app.use(
  cors({
    origin: `${IP}`
  })
);

// get user ip
app.set('trust proxy', true);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use(`/api/${API_VERSION}`, rateLimiterRoute, [
  require('./routes/page_route'),
  require('./routes/message_route'),
  require('./routes/signup_route'),
  require('./routes/comment_route'),
  require('./routes/dashboard_route'),
  require('./routes/group_route'),
  require('./routes/profile_route'),
  require('./routes/user_route')
]);

// Error handling
app.use((err, req, res, next) => {
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

module.exports = app;
