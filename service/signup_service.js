const formData = require('form-data');
const Mailgun = require('mailgun.js');
const fs = require('fs');

// 使用者報名，寄信通知主揪
const sigupEmail = async (groupId, username, creator, creatorEmail) => {
  // 路徑默認與 app.js 同層
  let html = fs.readFileSync('./utils/email/mail_signup.html').toString();
  html = html.replace('creator', creator);
  html = html.replace('username', username);
  html = html.replace(
    'group-link',
    `${process.env.IP}group.html?id=${groupId}`
  );

  const mailgun = new Mailgun(formData);
  const client = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY
  });

  const messageData = {
    from: 'PLAYONE 排球揪團 <notify@mailgun.org>',
    to: creatorEmail,
    subject: '有人報名你的揪團囉!',
    html
  };
  await client.messages.create(process.env.MAILGUN_DOMAIN, messageData);
};

// 主揪確認報名，寄信通知使用者
const replyEmail = async (groupId, username, userEmail, signUpStatus) => {
  // 路徑默認與 app.js 同層
  let html = fs.readFileSync('./utils/email/reply_signup.html').toString();
  html = html.replace('username', username);
  html = html.replace(
    'group-link',
    `${process.env.IP}group.html?id=${groupId}`
  );

  const mailgun = new Mailgun(formData);
  const client = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY
  });

  const subject =
    signUpStatus === '1'
      ? '恭喜! 主揪已同意您的報名'
      : '很抱歉! 主揪已拒絕您的報名';
  const messageData = {
    from: 'PLAYONE 排球揪團 <notify@mailgun.org>',
    to: userEmail,
    subject,
    html
  };
  await client.messages.create(process.env.MAILGUN_DOMAIN, messageData);
};

module.exports = { sigupEmail, replyEmail };
