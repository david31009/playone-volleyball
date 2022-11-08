const { myLevel, gender, position } = require('../utils/enum');
const User = require('../models/user_model');

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
    info.userId,
  ];
  myInfo = myInfo.map((i) => {
    if (i === '' || i === undefined) {
      i = null;
    }
    return i;
  });
  await User.updateUser(myInfo);
  res.status(200).send('ok');
};

const userProfile = async (req, res) => {
  const { id } = req.query;
  const resultDB = await User.userProfile([id]);
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
      position_2: [i.position_2, position[i.position_2]],
    };
  });
  res.status(200).json({ result });
};

module.exports = { updateUser, userProfile };
