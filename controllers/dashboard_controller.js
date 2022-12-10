const moment = require('moment');
const Dashboard = require('../models/dashboard_model');

const getCreateGroup = async (req, res) => {
  const { id } = req.query;
  const resultDB = await Dashboard.getCreateGroup(id);
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

const getSignupGroup = async (req, res) => {
  const { id } = req.query;
  const resultDB = await Dashboard.getSignupGroup(id);
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

const getPastCreateGroup = async (req, res) => {
  const { id } = req.query;
  const resultDB = await Dashboard.getPastCreateGroup(id);
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

const getPastSignupGroup = async (req, res) => {
  const { id } = req.query;
  const resultDB = await Dashboard.getPastSignupGroup(id);
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

module.exports = {
  getCreateGroup,
  getSignupGroup,
  getPastCreateGroup,
  getPastSignupGroup
};
