const axios = require('axios');
require('dotenv').config({ path: '../.env' });

for (let i = 0; i < 501; i++) {
  axios
    .get(`${process.env.IP}api/1.0/group`)
    .then((result) => {
      console.log(result.status);
    })
    .catch((result) => {
      console.log(result.response.status);
    });
}
