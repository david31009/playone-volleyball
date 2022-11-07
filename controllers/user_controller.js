const { myLevel, gender } = require('../utils/enum');
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
  console.log(myInfo);
  await User.updateUser(myInfo);
  res.status(200).send('ok');
};

module.exports = { updateUser };
