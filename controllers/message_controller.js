const moment = require('moment');
const Message = require('../models/message_model');

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
  await Message.createMsg(msgInfo);
  res.status(200).send('ok');
};

const getMsg = async (req, res) => {
  const { id } = req.query;
  const resultDB = await Message.getMsg([id]);
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

module.exports = {
  createMsg,
  getMsg
};
