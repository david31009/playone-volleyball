const moment = require('moment');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const fs = require('fs');

const {
  groupLevel,
  netHigh,
  court,
  isBuild,
  isCharge,
  signupStatus
} = require('../utils/enum');
const Group = require('../models/group_model');

const createGroup = async (req, res) => {
  const info = req.body;
  const { user } = req;
  const creatorId = user.userId;
  const isBuild = 1; // 已成團
  const peopleLeft = info.peopleNeed; // 剩餘報名名額
  let isCharge = 1; // 是否收費
  if (info.money === '0') isCharge = 0;

  const groupInfo = [
    creatorId,
    info.title,
    `${info.date} ${info.time}`,
    info.timeDuration * 60,
    info.net,
    info.county + info.district,
    info.placeDescription,
    info.court,
    isCharge,
    info.money,
    info.level,
    info.levelDescription,
    info.peopleHave,
    info.peopleNeed,
    peopleLeft,
    info.groupDescription,
    isBuild
  ];

  // 阻擋欄位未輸入
  if (groupInfo.includes('')) {
    return res.status(400).json({ error: '每個欄位都要輸入!' });
  }

  // 存入 DB，傳入 array，回傳建立的 groupId
  const groupId = await Group.createGroup(groupInfo);
  res.status(200).json({ groupId });
};

const getGroups = async (req, res) => {
  const resultDB = await Group.getGroups();
  const { groups } = resultDB;
  const { totalRecords } = resultDB;

  // 第一頁資料 (10筆)
  const firstPage = groups.map((i) => {
    moment.locale('zh-tw');
    const datetime = moment(i.date).format('YYYY-MM-DD HH:mm');
    const day = moment(i.date).format('dddd')[2]; // 星期幾
    return {
      groupId: i.id,
      title: i.title,
      date: `${datetime.split(' ')[0]} (${day})`,
      time: datetime.split(' ')[1],
      timeDuration: i.time_duration / 60,
      net: netHigh[i.net],
      place: i.place,
      placeDescription: i.place_description,
      money: i.money,
      groupLevel: groupLevel[i.level],
      peopleHave: i.people_have,
      peopleNeed: i.people_need,
      username: i.username
    };
  });

  // 計算共幾頁
  const pageSize = 10; // 每頁 10 筆
  let totalPage = Math.floor(totalRecords / pageSize); // 無條件捨去
  if (totalRecords % pageSize === 0) {
    totalPage = totalRecords / pageSize;
  } else {
    totalPage += 1;
  }

  res.status(200).json({ firstPage, totalPage });
};

const nextPage = async (req, res) => {
  const { page } = req.body;
  const pageSize = 10;
  const startRecord = (page - 1) * pageSize;
  const result = await Group.nextPage(`${startRecord}`, `${pageSize}`);
  // console.log(result);

  const nextPageGroup = result.map((i) => {
    moment.locale('zh-tw');
    const datetime = moment(i.date).format('YYYY-MM-DD HH:mm');
    const day = moment(i.date).format('dddd')[2]; // 星期幾
    return {
      groupId: i.id,
      title: i.title,
      date: `${datetime.split(' ')[0]} (${day})`,
      time: datetime.split(' ')[1],
      timeDuration: i.time_duration / 60,
      net: netHigh[i.net],
      place: i.place,
      placeDescription: i.place_description,
      money: i.money,
      groupLevel: groupLevel[i.level],
      peopleHave: i.people_have,
      peopleNeed: i.people_need,
      username: i.username
    };
  });

  res.status(200).json({ nextPageGroup });
};

const filterGroups = async (req, res) => {
  const info = req.body;
  const pageSize = 10; // 每頁 10 筆
  let { page } = info;
  page = (page - 1) * pageSize;

  // % 是 sql like 語法用來做相似搜尋
  const resultDB = await Group.filterGroups(
    `${info.county}%`,
    `%${info.district}`,
    `%${info.groupLevel}`,
    `%${info.net}`,
    `%${info.court}`,
    `%${info.isCharge}`,
    `${page}`
  );
  const { groups } = resultDB;
  const { totalRecords } = resultDB;

  const perPage = groups.map((i) => {
    moment.locale('zh-tw');
    const datetime = moment(i.date).format('YYYY-MM-DD HH:mm');
    const day = moment(i.date).format('dddd')[2]; // 星期幾
    return {
      groupId: i.id,
      title: i.title,
      date: `${datetime.split(' ')[0]} (${day})`,
      time: datetime.split(' ')[1],
      timeDuration: i.time_duration / 60,
      net: netHigh[i.net],
      place: i.place,
      placeDescription: i.place_description,
      money: i.money,
      groupLevel: groupLevel[i.level],
      peopleHave: i.people_have,
      peopleNeed: i.people_need,
      username: i.username
    };
  });

  // 計算共幾頁
  let totalPage = Math.floor(totalRecords / pageSize); // 無條件捨去
  if (totalRecords % pageSize === 0) {
    totalPage = totalRecords / pageSize;
  } else {
    totalPage += 1;
  }
  res.status(200).json({ perPage, totalPage });
};

const groupDetails = async (req, res) => {
  if (req.query.id === undefined) {
    res.status(400).json({ error: 'No groupId' });
    return;
  }
  const { id } = req.query;
  const resultDB = await Group.groupDetails([id]);
  if (resultDB.length === 0) {
    res.status(400).json({ error: 'No group' });
    return;
  }
  const result = resultDB.map((i) => {
    moment.locale('zh-tw');
    const datetime = moment(i.date).format('YYYY-MM-DD HH:mm');
    const day = moment(i.date).format('dddd')[2]; // 星期幾
    // 對照表，數字跟中文都給
    return {
      groupId: i.id,
      creatorId: i.creator_id,
      username: i.username,
      title: i.title,
      datetime: i.date,
      date: `${datetime.split(' ')[0]} (${day})`,
      time: datetime.split(' ')[1],
      timeDuration: i.time_duration / 60,
      net: [i.net, netHigh[i.net]],
      place: i.place,
      placeDescription: i.place_description,
      court: [i.court, court[i.court]],
      isCharge: [i.is_charge, isCharge[i.is_charge]],
      money: i.money,
      groupLevel: [i.level, groupLevel[i.level]],
      groupLevelDescription: i.level_description,
      peopleHave: i.people_have,
      peopleNeed: i.people_need,
      peopleLeft: i.people_left,
      groupDescription: i.group_description,
      isBuild: [i.is_build, isBuild[i.is_build]]
    };
  });
  res.status(200).json({ result });
};

const updateGroup = async (req, res) => {
  const info = req.body;
  let isCharge = 1; // 是否收費
  if (info.money === '0') isCharge = 0;

  const updateInfo = [
    info.title,
    `${info.date} ${info.time}`,
    info.timeDuration * 60,
    info.net,
    info.county + info.district,
    info.placeDescription,
    info.court,
    isCharge,
    info.money,
    info.level,
    info.levelDescription,
    info.peopleHave,
    info.peopleNeed,
    info.groupDescription,
    info.groupId
  ];

  // 阻擋欄位未輸入
  if (updateInfo.includes('')) {
    return res.status(400).json({ error: '每個欄位都要輸入!' });
  }

  await Group.updateGroup(updateInfo);
  res.status(200).send('ok');
};

// 使用者報名，寄信通知主揪
const sigupEmail = async (groupId, username, creator, creatorEmail) => {
  // 路徑默認與 app.js 同層
  let html = fs.readFileSync('./utils/mail_signup.html').toString();
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

const signupGroup = async (req, res) => {
  const info = req.body;
  const { user } = req;
  const signupInfo = [info.userId, info.groupId, info.signupStatus];

  // 回傳主揪名字、主揪 email
  const [creator] = await Group.signupGroup(signupInfo);

  // 有人報名，寄信給主揪
  await sigupEmail(
    info.groupId,
    user.username,
    creator.username,
    creator.email
  );

  res.status(200).json({ result: 'Sign up sucessfully!' });
};

const getSignupStatus = async (req, res) => {
  const info = req.body;
  const memberInfo = [info.userId, info.groupId];
  const resultDB = await Group.getSignupStatus(memberInfo);
  const result = resultDB.map((i) => {
    return {
      userId: i.user_id,
      groupId: i.group_id,
      signupStatus: [i.signup_status, signupStatus[i.signup_status]]
    };
  });
  res.status(200).json({ result });
};

const createMsg = async (req, res) => {
  const info = req.body;
  // 阻擋留言為空狀況
  if (info.content === '') {
    return res.status(400).json({ error: 'message is blank' });
  }

  // 取得現在時間
  const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
  const msgInfo = [info.userId, info.groupId, info.content, datetime];
  await Group.createMsg(msgInfo);
  res.status(200).send('ok');
};

const getMsg = async (req, res) => {
  const { id } = req.query;
  const resultDB = await Group.getMsg([id]);
  moment.locale('zh-tw');
  const result = resultDB.map((i) => {
    return {
      userId: i.user_id,
      username: i.username,
      groupId: i.group_id,
      content: i.content,
      time: moment(i.time).startOf('minute').fromNow()
    };
  });

  res.status(200).json({ result });
};

const getSignupMembers = async (req, res) => {
  const { id } = req.query;
  const resultDB = await Group.getSignupMembers([id]);
  const result = resultDB.map((i) => {
    return {
      userId: i.user_id,
      username: i.username,
      groupId: i.group_id,
      signupStatus: i.signup_status
    };
  });
  res.status(200).json({ result });
};

// 主揪確認報名，寄信通知使用者
const replyEmail = async (groupId, username, userEmail, signupStatus) => {
  // 路徑默認與 app.js 同層
  let html = fs.readFileSync('./utils/reply_signup.html').toString();
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
    signupStatus === '1'
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

const decideSignupStatus = async (req, res) => {
  const info = req.body;
  const updateInfo = [
    info.userId,
    info.groupId,
    info.statusCode,
    info.peopleLeft
  ];

  const [user] = await Group.decideSignupStatus(updateInfo);
  // console.log(user);
  await replyEmail(
    user.group_id,
    user.username,
    user.email,
    user.signup_status
  );
  res.status(200).send('ok');
};

const closeGroup = async (req, res) => {
  const { groupId } = req.body;
  await Group.closeGroup([groupId]);
  res.status(200).send('ok');
};

module.exports = {
  createGroup,
  getGroups,
  filterGroups,
  groupDetails,
  updateGroup,
  signupGroup,
  getSignupStatus,
  createMsg,
  getMsg,
  getSignupMembers,
  decideSignupStatus,
  closeGroup,
  nextPage
};
