const router = require('express').Router();
const { wrapAsync } = require('../utils/util');
const {
  updateUser,
  userProfile,
  follow,
  followStatus,
  unfollow,
} = require('../controllers/user_controller');

router.route('/user').put(wrapAsync(updateUser));
router.route('/user').get(wrapAsync(userProfile));
router.route('/follow').post(wrapAsync(follow));
router.route('/follow/status').post(wrapAsync(followStatus));
router.route('/unfollow').post(wrapAsync(unfollow));

module.exports = router;
