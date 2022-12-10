require('dotenv').config({ path: '../.env' });
const moment = require('moment');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const fs = require('fs');
const Cache = require('../utils/cache');
const Group = require('../models/group_model');
const { groupLevel, netHigh } = require('../utils/enum');

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
        if (diff > 0) {
          Cache.set(`group-${resultDB.id}`, JSON.stringify(data), { PX: diff });
        }
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

// 主揪揪團，寄信給粉絲
const notifyFans = async (groupIdAndFans) => {
  const { groupId } = groupIdAndFans;
  const { fans } = groupIdAndFans;

  for (let i = 0; i < fans.length; i++) {
    // 路徑默認與 app.js 同層
    let html = fs.readFileSync('./utils/email/notify_fans.html').toString();
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

module.exports = { checkRedis, notifyFans };
