const { netHigh, groupLevel } = require('../utils/enum');
const Group = require('../models/group_model');

const createGroup = async (req, res) => {
  const info = req.body;
  const creatorId = 1; // 看是哪個 user
  const isBuild = 1; // 已成團
  const peopleLeft = info.peopleNeed; // 剩餘報名名額

  const groupInfo = [
    creatorId,
    info.title,
    `${info.date} ${info.time}`,
    info.timeDuration * 60,
    info.net,
    info.county + info.district,
    info.placeDescription,
    info.court,
    info.money,
    info.level,
    info.levelDescription,
    info.peopleHave,
    info.peopleNeed,
    peopleLeft,
    info.groupDescription,
    isBuild,
  ];

  // 阻擋欄位未輸入
  if (groupInfo.includes('')) {
    return res.status(400).json({ error: '每個欄位都要輸入!' });
  }

  // 存入 DB，傳入 array，回傳建立的 groupId
  const groupId = await Group.createGroup(groupInfo);
  console.log('groupId: ', groupId);
  res.status(200).json({ groupId });
};

const getCards = async (req, res) => {
  const resultDB = await Group.getCards();
  const result = resultDB.map((i) => {
    // date 是 object 型態
    let datetime = JSON.stringify(i.date).replace('"', '');
    return {
      groupId: i.id,
      title: i.title,
      date: datetime.split('T')[0],
      time: datetime.split('T')[1].slice(0, 5),
      timeDuration: i.time_duration / 60,
      net: netHigh[i.net],
      place: i.place,
      placeDescription: i.place_description,
      money: i.money,
      groupLevel: groupLevel[i.level],
      peopleHave: i.people_have,
      peopleNeed: i.people_need,
      username: i.username,
    };
  });
  res.status(200).json({ result });
};
module.exports = { createGroup, getCards };
