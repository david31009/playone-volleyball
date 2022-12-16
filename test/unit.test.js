require('dotenv').config({ path: '.env' });
const jwt = require('jsonwebtoken');
const { generateJwtToken } = require('../service/user_service');

const { TOKEN_SECRET, EXPIRE } = process.env;

test('test generating jwt token', () => {
  const userId = 1;
  const username = 'Timmy';
  const email = 'timmy@gmail.com';
  const jwtToken = generateJwtToken(userId, username, email, TOKEN_SECRET, EXPIRE);
  const userInfo = jwt.verify(jwtToken, TOKEN_SECRET);
  expect(userInfo).toEqual(
    expect.objectContaining({
      userId: expect.any(Number),
      username: expect.any(String),
      email: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number)
    })
  );
});
