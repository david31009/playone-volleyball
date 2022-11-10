const router = require('express').Router();
const { wrapAsync } = require('../utils/util');
const {
  updateUser,
  userProfile,
  follow,
  followStatus,
  unfollow,
  nowCreate,
  pastCreate,
  nowSignup,
  pastSignup,
} = require('../controllers/user_controller');

router.route('/user').put(wrapAsync(updateUser));
router.route('/user').get(wrapAsync(userProfile));
router.route('/follow').post(wrapAsync(follow));
router.route('/follow/status').post(wrapAsync(followStatus));
router.route('/unfollow').post(wrapAsync(unfollow));
router.route('/now/create').get(wrapAsync(nowCreate));
router.route('/past/create').get(wrapAsync(pastCreate));
router.route('/now/signup').get(wrapAsync(nowSignup));
router.route('/past/signup').get(wrapAsync(pastSignup));

module.exports = router;
