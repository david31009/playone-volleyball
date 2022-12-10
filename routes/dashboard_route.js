const router = require('express').Router();
const { wrapAsync } = require('../utils/util');

const {
  getCreateGroup,
  getSignupGroup,
  getPastCreateGroup,
  getPastSignupGroup
} = require('../controllers/dashboard_controller');

router.route('/now/create').get(wrapAsync(getCreateGroup));
router.route('/now/signup').get(wrapAsync(getSignupGroup));
router.route('/past/create').get(wrapAsync(getPastCreateGroup));
router.route('/past/signup').get(wrapAsync(getPastSignupGroup));

module.exports = router;
