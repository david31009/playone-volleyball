const express = require('express');
const request = require('supertest');
const msgRoute = require('../routes/message_route');

const app = express();

app.use(express.json());
app.use('/api/1.0', msgRoute);

describe('Integration tests for the msg API', () => {
  it('GET /api/1.0/msg', async () => {
    const { body, statusCode } = await request(app).get('/api/1.0/msg?id=1');

    expect(body).toEqual(
      expect.objectContaining({
        result: expect.arrayContaining([
          expect.objectContaining({
            userId: expect.any(Number),
            username: expect.any(String),
            groupId: expect.any(Number),
            content: expect.any(String),
            time: expect.any(String)
          })
        ])
      })
    );

    expect(statusCode).toBe(200);
  });
});
