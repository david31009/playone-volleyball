const app = require('./app');
const Cache = require('./utils/cache');

const { PORT } = process.env;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Connecting to redis...');
  Cache.connect().catch(() => {
    console.log('Error in Redis');
  });
});
