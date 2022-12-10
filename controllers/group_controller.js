const moment = require('moment');
const Cache = require('../utils/cache');
const { checkRedis, notifyFans } = require('../service/group_service');

const {
  groupLevel,
  netHigh,
  court,
  isBuild,
  isCharge
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

module.exports = {
  createGroup,
  getGroups,
  filterGroups,
  groupDetails,
  updateGroup,
  closeGroup,
  sseNotify
};
