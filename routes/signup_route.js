const router = require('express').Router();
const { wrapAsync, auth } = require('../utils/util');
const {
  getSignupMembers,
  signupGroup,
  getSignupStatus,
  updateSignupStatus
} = require('../controllers/signup_controller');

router.route('/signup/member').get(wrapAsync(getSignupMembers));
router.route('/signup/group').post(auth, wrapAsync(signupGroup));
router.route('/signup/status').post(wrapAsync(getSignupStatus));
router.route('/signup/status').put(auth, wrapAsync(updateSignupStatus));

module.exports = router;
