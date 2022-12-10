const { sigupEmail, replyEmail } = require('../service/signup_service');
const { signupStatus } = require('../utils/enum');
const Signup = require('../models/signup_model');

const getSignupMembers = async (req, res) => {
  const { id } = req.query;
  const resultDB = await Signup.getSignupMembers([id]);
  const result = resultDB.map((i) => {
    return {
      userId: i.user_id,
      username: i.username,
      groupId: i.group_id,
      signupStatus: i.signup_status
    };
  });
  res.status(200).json({ result });
};

const signupGroup = async (req, res) => {
  const info = req.body;
  const { user } = req;
  const signupInfo = [info.userId, info.groupId, info.signupStatus];

  // 回傳主揪名字、主揪 email
  const [creator] = await Signup.signupGroup(signupInfo);

  // 有人報名，寄信給主揪
  await sigupEmail(
    info.groupId,
    user.username,
    creator.username,
    creator.email
  );

  res.status(200).json({ result: 'Sign up sucessfully!' });
};

const getSignupStatus = async (req, res) => {
  const info = req.body;
  const memberInfo = [info.userId, info.groupId];
  const resultDB = await Signup.getSignupStatus(memberInfo);
  const result = resultDB.map((i) => {
    return {
      userId: i.user_id,
      groupId: i.group_id,
      signupStatus: [i.signup_status, signupStatus[i.signup_status]]
    };
  });
  res.status(200).json({ result });
};

const updateSignupStatus = async (req, res) => {
  const info = req.body;
  const updateInfo = [
    info.userId,
    info.groupId,
    info.statusCode,
    info.peopleLeft
  ];

  const [user] = await Signup.updateSignupStatus(updateInfo);
  await replyEmail(
    user.group_id,
    user.username,
    user.email,
    user.signup_status
  );

  res.status(200).send('ok');
};

module.exports = {
  getSignupMembers,
  signupGroup,
  getSignupStatus,
  updateSignupStatus
};
