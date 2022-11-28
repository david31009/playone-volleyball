const redis = require('redis');

// 利用 redis 套件，連接 EC2 redis
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.ready = false;

redisClient.on('ready', () => {
  redisClient.ready = true;
  console.log('Redis is ready');
});

redisClient.on('error', () => {
  redisClient.ready = false;
  // console.log('Redis is not connected');
});

module.exports = redisClient;
