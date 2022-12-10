const moment = require('moment');
const Comment = require('../models/comment_model');

const commentTitle = async (req, res) => {
  const { groupId } = req.body;
  const [resultDB] = await Comment.commentTitle([groupId]);
  const datetime = moment(resultDB.date).format('YYYY-MM-DD HH:mm');
  const result = [
    {
      groupId: resultDB.id,
      title: resultDB.title,
      date: datetime.split(' ')[0],
      time: datetime.split(' ')[1]
    }
  ];
  res.status(200).json({ result });
};

const getCommentStatus = async (req, res) => {
  const info = req.body;
  const result = await Comment.getCommentStatus([
    info.commenterId,
    info.groupId
  ]);

  res.status(200).json({ result });
};

const sendComment = async (req, res) => {
  const info = req.body;

  // 阻擋評價超過 255 字
  if (info.content.length > 255) {
    return res.status(400).json({ error: 'Exceed word limit' });
  }

  const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
  const comment = [
    info.creatorId,
    info.commentorId,
    info.groupId,
    info.score,
    info.content,
    currentDate
  ];
  await Comment.sendComment(comment);
  res.status(200).send('ok');
};

const getComments = async (req, res) => {
  const { id } = req.query;
  const resultDB = await Comment.getComments([id]);
  const result = resultDB.map((i) => {
    const date = moment(i.date).format('YYYY-MM-DD HH:mm');
    return {
      commenterId: i.commenter_id,
      commenterName: i.username,
      groupId: i.group_id,
      score: i.score,
      date,
      title: i.title,
      content: i.content
    };
  });
  res.status(200).json({ result });
};

module.exports = {
  commentTitle,
  getCommentStatus,
  sendComment,
  getComments
};
