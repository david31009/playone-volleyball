const moment = require('moment');
const { myLevel, gender, position } = require('../utils/enum');
const Profile = require('../models/profile_model');

const updateUser = async (req, res) => {
  const info = req.body;
  let myInfo = [
    info.username,
    info.gender,
    info.county,
    info.position[0],
    info.position[1],
    info.myLevel,
    info.myLevelDes,
    info.selfIntro,
    info.userId
  ];
  myInfo = myInfo.map((i) => {
    if (i === '' || i === undefined) {
      i = null;
    }
    return i;
  });
  await Profile.updateUser(myInfo);
  res.status(200).send('ok');
};

const userProfile = async (req, res) => {
  if (req.query.id === undefined) {
    res.status(400).json({ error: 'No userId' });
    return;
  }
  const { id } = req.query;
  const resultDB = await Profile.userProfile([id]);
  if (resultDB.length === 0) {
    res.status(400).json({ error: 'No user' });
    return;
  }
  const result = resultDB.map((i) => {
    return {
      username: i.username,
      gender: [i.gender, gender[i.gender]],
      intro: i.intro,
      county: i.county,
      myLevel: [i.my_level, myLevel[i.my_level]],
      myLevelDes: i.my_level_description,
      fans: i.fans,
      follow: i.follow,
      position_1: [i.position_1, position[i.position_1]],
      position_2: [i.position_2, position[i.position_2]]
    };
  });
  res.status(200).json({ result });
};

const follow = async (req, res) => {
  const info = req.body;
  await Profile.follow([info.userId, info.followId]);
  res.status(200).send('ok');
};

const followStatus = async (req, res) => {
  const info = req.body;
  const [result] = await Profile.followStatus([info.userId, info.followId]);
  res.status(200).json({ result });
};

const unfollow = async (req, res) => {
  const info = req.body;
  await Profile.unfollow([info.userId, info.followId]);
  res.status(200).send('ok');
};

const nowCreate = async (req, res) => {
  const { id } = req.query;
  const resultDB = await Profile.nowCreate(id);
  const result = resultDB.map((i) => {
    const datetime = moment(i.date).format('YYYY-MM-DD HH:mm');
    return {
      groupId: i.id,
      title: i.title,
      date: datetime.split(' ')[0],
      time: datetime.split(' ')[1]
    };
  });
  res.status(200).json({ result });
};

const pastCreate = async (req, res) => {
  const { id } = req.query;
  const resultDB = await Profile.pastCreate(id);
  const result = resultDB.map((i) => {
    const datetime = moment(i.date).format('YYYY-MM-DD HH:mm');
    return {
      groupId: i.id,
      title: i.title,
      date: datetime.split(' ')[0],
      time: datetime.split(' ')[1]
    };
  });
  res.status(200).json({ result });
};

const nowSignup = async (req, res) => {
  const { id } = req.query;
  const resultDB = await Profile.nowSignup(id);
  const result = resultDB.map((i) => {
    const datetime = moment(i.date).format('YYYY-MM-DD HH:mm');
    return {
      groupId: i.group_id,
      title: i.title,
      date: datetime.split(' ')[0],
      time: datetime.split(' ')[1]
    };
  });
  res.status(200).json({ result });
};

const pastSignup = async (req, res) => {
  const { id } = req.query;
  const resultDB = await Profile.pastSignup(id);
  const result = resultDB.map((i) => {
    const datetime = moment(i.date).format('YYYY-MM-DD HH:mm');
    return {
      groupId: i.group_id,
      title: i.title,
      creatorId: i.creator_id,
      date: datetime.split(' ')[0],
      time: datetime.split(' ')[1]
    };
  });
  res.status(200).json({ result });
};

const groupInfo = async (req, res) => {
  const { groupId } = req.body;
  const [resultDB] = await Profile.groupInfo([groupId]);
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

const storeComment = async (req, res) => {
  const info = req.body;
  const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
  const comment = [
    info.creatorId,
    info.commentorId,
    info.groupId,
    info.score,
    info.content,
    currentDate
  ];
  await Profile.storeComment(comment);
  res.status(200).send('ok');
};

const commentStatus = async (req, res) => {
  const info = req.body;
  const result = await Profile.commentStatus([info.commenterId, info.groupId]);
  res.status(200).json({ result });
};

const getComments = async (req, res) => {
  const { id } = req.query;
  const resultDB = await Profile.getComments([id]);
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
  updateUser,
  userProfile,
  follow,
  followStatus,
  unfollow,
  nowCreate,
  pastCreate,
  nowSignup,
  pastSignup,
  groupInfo,
  storeComment,
  commentStatus,
  getComments
};
