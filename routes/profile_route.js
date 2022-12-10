const router = require('express').Router();
const { wrapAsync, auth, injectionCheck } = require('../utils/util');
const {
  updateUserProfile,
  getUserProfile,
  follow,
  unfollow,
  followStatus,
  getFollowList,
  getFansList
} = require('../controllers/profile_controller');

router.route('/user').put(auth, injectionCheck, wrapAsync(updateUserProfile));
router.route('/user').get(wrapAsync(getUserProfile));
router.route('/follow').post(auth, wrapAsync(follow));
router.route('/unfollow').post(wrapAsync(unfollow));
router.route('/follow/status').post(wrapAsync(followStatus));
router.route('/follow').get(wrapAsync(getFollowList));
router.route('/fans').get(wrapAsync(getFansList));

module.exports = router;
