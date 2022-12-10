const moment = require('moment');
const { groupLevel, netHigh } = require('../utils/enum');
const Group = require('../models/page_model');

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

module.exports = {
  nextPage,
  allPage
};
