const validator = require('validator');
const { myLevel, gender, position } = require('../utils/enum');
const Profile = require('../models/profile_model');

const updateUserProfile = async (req, res) => {
  const info = req.body;

  // 姓名不能包含 dash(-)
  const username = validator.blacklist(info.username, '-');
  const pos = info.position.split(',');
  let myInfo = [
    username,
    info.gender,
    info.county,
    pos[0],
    pos[1],
    info.myLevel,
    info.myLevelDes,
    info.selfIntro,
    info.userId
  ];

  // 阻擋姓名字數 > 20字、自介字數 > 500、自評程度字數 > 500
  if (
    info.username.length > 20 ||
    info.myLevelDes.length > 500 ||
    info.selfIntro.length > 500
  ) {
    return res.status(400).json({ error: 'Exceed word limit' });
  }

  // 未填資訊轉換成 null
  myInfo = myInfo.map((i) => {
    if (i === '' || i === undefined) {
      i = null;
    }
    return i;
  });

  await Profile.updateUserProfile(myInfo);
  res.status(200).send('ok');
};

const getUserProfile = async (req, res) => {
  if (req.query.id === undefined) {
    res.status(400).json({ error: 'No userId' });
    return;
  }
  const { id } = req.query;
  const resultDB = await Profile.getUserProfile([id]);
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

const unfollow = async (req, res) => {
  const info = req.body;
  await Profile.unfollow([info.userId, info.followId]);
  res.status(200).send('ok');
};

const followStatus = async (req, res) => {
  const info = req.body;
  const [result] = await Profile.followStatus([info.userId, info.followId]);
  res.status(200).json({ result });
};

const getFollowList = async (req, res) => {
  const { id } = req.query;
  const resultDB = await Profile.getFollowList([id]);
  const result = resultDB.map((i) => {
    return {
      userId: i.user_id,
      id: i.id,
      username: i.username
    };
  });
  res.status(200).json({ result });
};

const getFansList = async (req, res) => {
  const { id } = req.query;
  const resultDB = await Profile.getFansList([id]);
  const result = resultDB.map((i) => {
    return {
      followId: i.follow_id,
      id: i.id,
      username: i.username
    };
  });
  res.status(200).json({ result });
};

module.exports = {
  updateUserProfile,
  getUserProfile,
  follow,
  followStatus,
  unfollow,
  getFollowList,
  getFansList
};
