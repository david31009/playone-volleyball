const jwt = require('jsonwebtoken');

const generateJwtToken = (userId, username, email, secret, expire) => {
  const jwtToken = jwt.sign(
    {
      userId,
      username,
      email
    },
    secret,
    {
      expiresIn: expire
    }
  );
  return jwtToken;
};

module.exports = { generateJwtToken };
