// Express Initialization
const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();
const { PORT, API_VERSION } = process.env;

// CORS allow all
app.use(cors());

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/' + API_VERSION, [require('./routes/group_route')]);

// Error handling
app.use(function (err, req, res, next) {
  // 接系統的錯誤，不讓 server crash
  console.log(err);
  res.status(500).send('Internal Server Error');
});

//set port to 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
