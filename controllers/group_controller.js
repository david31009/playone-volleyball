const moment = require('moment');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const fs = require('fs');
const Cache = require('../utils/cache');

const {
  groupLevel,
  netHigh,
  court,
  isBuild,
  isCharge,
  signupStatus
} = require('../utils/enum');
const Group = require('../models/group_model');

let clients = [];
const sseNotify = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no'); // fix sse problem on https
  res.flushHeaders();

  res.sseId = Date.now();
  clients.push({ res });

  res.on('close', () => {
    // 把使用者下線的 Id 移掉
    clients = clients.filter((client) => client.res.sseId !== res.sseId);
    res.end();
  });
};

// 主揪揪團，寄信給粉絲
const notifyFans = async (groupIdAndFans) => {
  const { groupId } = groupIdAndFans;
  const { fans } = groupIdAndFans;

  for (let i = 0; i < fans.length; i++) {
    // 路徑默認與 app.js 同層
    let html = fs.readFileSync('./utils/notify_fans.html').toString();
    html = html.replace('username', fans[i].username);
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
      to: fans[i].email,
      subject: '您追蹤的主揪，剛建立了一個新的揪團!',
      html
    };
    await client.messages.create(process.env.MAILGUN_DOMAIN, messageData);
  }
};

const checkRedis = async (groupId) => {
  // 撈 group detail
  const [resultDB] = await Group.groupDetails([groupId]);
  moment.locale('zh-tw'); // 台灣時間
  const datetime = moment(resultDB.date).format('YYYY-MM-DD HH:mm');
  const day = moment(resultDB.date).format('dddd')[2]; // 星期幾
  const timeNow = moment().valueOf(); // 現在時間轉成微秒
  const groupTime = moment(resultDB.date).valueOf();

  const data = {
    groupId: resultDB.id,
    title: resultDB.title,
    date: `${datetime.split(' ')[0]} (${day})`,
    time: datetime.split(' ')[1],
    timeDuration: resultDB.time_duration / 60,
    net: netHigh[resultDB.net],
    place: resultDB.place,
    placeDescription: resultDB.place_description,
    money: resultDB.money,
    groupLevel: groupLevel[resultDB.level],
    peopleHave: resultDB.people_have,
    peopleNeed: resultDB.people_need,
    username: resultDB.username,
    groupTime
  };

  const arr = [];
  let deleteFirst = false;
  // 從 cache 取資料，比對與新建團的時間
  if (Cache.ready === true) {
    const keys = await Cache.keys('group-*');
    for (let i = 0; i < keys.length; i++) {
      let value = await Cache.get(keys[i]);
      value = JSON.parse(value);
      arr.push(value);

      if (groupTime < value.groupTime) {
        deleteFirst = true;
        const diff = groupTime - timeNow; // 現在時間距離未來揪團的差距 in milliseconds
        Cache.set(`group-${resultDB.id}`, JSON.stringify(data), { PX: diff });
      }
    }
  }

  // 依揪團時間(新到舊)排序
  arr.sort((a, b) => {
    return b.groupTime - a.groupTime;
  });

  if (deleteFirst) {
    // 刪掉第一頁時間最新的
    Cache.del(`group-${arr[0].groupId}`);
  }
};

const createGroup = async (req, res) => {
  const info = req.body;
  const { user } = req; // 經過 auth，拿 userId
  const creatorId = user.userId;
  const Build = 1; // 已成團
  const peopleLeft = info.peopleNeed; // 剩餘報名名額
  let Charge = 1; // 是否收費

  // 阻擋 money 填入文字、非正整數、大於 65535 的數字
  const money = Number(info.money);
  if (money === 0) {
    Charge = 0;
  } else if (money > 65535 || !Number.isInteger(money)) {
    return res.status(400).json({ error: 'Money datatype and limit error' });
  }

  // 阻擋超過 DB 字數限制
  if (
    info.title.length > 20 ||
    info.placeDescription.length > 20 ||
    info.levelDescription.length > 255 ||
    info.groupDescription.length > 255
  ) {
    return res.status(400).json({
      error: 'Exceed word limit'
    });
  }

  const groupInfo = [
    creatorId,
    info.title,
    `${info.date} ${info.time}`,
    info.timeDuration * 60,
    info.net,
    info.county + info.district,
    info.placeDescription,
    info.court,
    Charge,
    info.money,
    info.level,
    info.levelDescription,
    info.peopleHave,
    info.peopleNeed,
    peopleLeft,
    info.groupDescription,
    Build
  ];

  // 阻擋欄位未輸入
  if (groupInfo.includes('')) {
    return res.status(400).json({ error: '每個欄位都要輸入!' });
  }

  // 存入 DB，傳入 array，回傳建立的 groupId
  const groupIdAndFans = await Group.createGroup(groupInfo, creatorId);

  // 寄信給粉絲
  await notifyFans(groupIdAndFans);

  // 檢查新團時間在 redis 中的排序
  const { groupId } = groupIdAndFans;
  await checkRedis(groupId);

  // 有人創團，通知所有在瀏覽網頁的人
  clients.forEach((client) => {
    client.res.write(`data: ${groupId}\n\n`);
  });

  res.status(200).json(groupIdAndFans);
};

const getGroups = async (req, res) => {
  // 連上 redis
  if (Cache.ready === true) {
    const keys = await Cache.keys('group-*'); // 找以 group 為開頭的key

    if (keys.length === 10) {
      const firstPage = [];
      for (let i = 0; i < keys.length; i++) {
        const value = await Cache.get(keys[i]);
        firstPage.push(JSON.parse(value));
      }

      // 快到期揪團會排在前面 (舊到新排列)
      firstPage.sort((a, b) => {
        return a.groupTime - b.groupTime;
      });

      console.log('Redis is connected, and the data is from redis.');
      res.status(200).json({ firstPage });
    } else {
      // 連上 redis，資料不足10筆 (有揪團過期消失)，重撈 DB，整理後再存進 redis
      for (let i = 0; i < keys.length; i++) {
        // 刪掉 redis 以 group- 為開頭的資料
        Cache.del(`${keys[i]}`);
      }

      const resultDB = await Group.getGroups();
      // 第一頁資料 (10筆)
      const firstPage = resultDB.map((i) => {
        moment.locale('zh-tw'); // 台灣時間
        const datetime = moment(i.date).format('YYYY-MM-DD HH:mm');
        const day = moment(i.date).format('dddd')[2]; // 星期幾
        const timeNow = moment().valueOf(); // 現在時間轉成微秒
        const groupTime = moment(i.date).valueOf(); // 揪團時間轉成微秒

        const data = {
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
          username: i.username,
          groupTime
        };

        // 存進 redis
        const diff = groupTime - timeNow; // 現在時間距離揪團時間的差距 in milliseconds
        Cache.set(`group-${i.id}`, JSON.stringify(data), { PX: diff });

        return data;
      });
      console.log('Redis is connected, but the data is from db.');
      res.status(200).json({ firstPage });
    }
  } else {
    // 沒連上 redis，重撈 DB
    const resultDB = await Group.getGroups();

    // 第一頁資料 (10筆)
    const firstPage = resultDB.map((i) => {
      moment.locale('zh-tw'); // 台灣時間
      const datetime = moment(i.date).format('YYYY-MM-DD HH:mm');
      const day = moment(i.date).format('dddd')[2]; // 星期幾
      const groupTime = moment(i.date).valueOf(); // 揪團時間轉成微秒

      const data = {
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
        username: i.username,
        groupTime
      };
      return data;
    });
    console.log('Redis is not connect. The data is from db');
    res.status(200).json({ firstPage });
  }
};

const allPage = async (req, res) => {
  const resultDB = await Group.allPage();
  const { totalRecords } = resultDB;

  // 計算共幾頁
  const pageSize = 10; // 每頁 10 筆
  let totalPage = Math.floor(totalRecords / pageSize); // 無條件捨去
  if (totalRecords % pageSize === 0) {
    totalPage = totalRecords / pageSize;
  } else {
    totalPage += 1;
  }

  res.status(200).json({ totalPage });
};

const nextPage = async (req, res) => {
  const { page } = req.body;
  const pageSize = 10;
  const startRecord = (page - 1) * pageSize;
  const result = await Group.nextPage(`${startRecord}`, `${pageSize}`);

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
  let Charge = 1; // 是否收費
  const peopleLeft = info.peopleNeed; // 剩餘報名名額

  // 阻擋 money 填入文字、非正整數、大於 65535 的數字
  const money = Number(info.money);
  if (money === 0) {
    Charge = 0;
  } else if (money > 65535 || !Number.isInteger(money)) {
    return res.status(400).json({ error: 'Money datatype and limit error' });
  }

  // 阻擋超過 DB 字數限制
  if (
    info.title.length > 20 ||
    info.placeDescription.length > 20 ||
    info.levelDescription.length > 255 ||
    info.groupDescription.length > 255
  ) {
    return res.status(400).json({
      error: 'Exceed word limit'
    });
  }

  const updateInfo = [
    info.title,
    `${info.date} ${info.time}`,
    info.timeDuration * 60,
    info.net,
    info.county + info.district,
    info.placeDescription,
    info.court,
    Charge,
    info.money,
    info.level,
    info.levelDescription,
    info.peopleHave,
    info.peopleNeed,
    peopleLeft,
    info.groupDescription,
    info.groupId
  ];

  // 阻擋欄位未輸入
  if (updateInfo.includes('')) {
    return res.status(400).json({ error: '每個欄位都要輸入!' });
  }

  await Group.updateGroup(updateInfo);

  // 檢查新團時間在 redis 中的排序
  const { groupId } = info;
  const closeTarget = `group-${groupId}`;
  if (Cache.ready === true) {
    Cache.del(closeTarget);
  }

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

  // 阻擋留言超過 255 字
  if (info.content.length > 255) {
    return res.status(400).json({ error: 'Exceed word limit' });
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
const replyEmail = async (groupId, username, userEmail, signUpStatus) => {
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

const decideSignupStatus = async (req, res) => {
  const info = req.body;
  const updateInfo = [
    info.userId,
    info.groupId,
    info.statusCode,
    info.peopleLeft
  ];

  const [user] = await Group.decideSignupStatus(updateInfo);
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

  // 檢查關閉團的 Id 是否在 redis 中
  const closeTarget = `group-${groupId}`;
  if (Cache.ready === true) {
    Cache.del(closeTarget);
  }
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
  nextPage,
  allPage,
  sseNotify
};
