const axios = require('axios');

for (let i = 0; i < 501; i++) {
  axios
    .get('http://localhost:3000/api/1.0/group')
    .then((result) => {
      console.log(result.status);
    })
    .catch((result) => {
      console.log(result.response.status);
    });
}
