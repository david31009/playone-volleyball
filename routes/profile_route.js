const router = require('express').Router();
const { wrapAsync, auth, injection } = require('../utils/util');
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
  groupInfo,
  storeComment,
  commentStatus,
  getComments,
  getFollow,
  getFans
} = require('../controllers/profile_controller');

router.route('/user').put(auth, injection, wrapAsync(updateUser));
router.route('/user').get(wrapAsync(userProfile));
router.route('/follow').post(auth, wrapAsync(follow));
router.route('/follow/status').post(wrapAsync(followStatus));
router.route('/unfollow').post(wrapAsync(unfollow));
router.route('/now/create').get(wrapAsync(nowCreate));
router.route('/past/create').get(wrapAsync(pastCreate));
router.route('/now/signup').get(wrapAsync(nowSignup));
router.route('/past/signup').get(wrapAsync(pastSignup));
router.route('/group/info').post(auth, wrapAsync(groupInfo));
router.route('/comment').post(auth, injection, wrapAsync(storeComment));
router.route('/comment/status').post(wrapAsync(commentStatus));
router.route('/comment').get(wrapAsync(getComments));
router.route('/comment').get(wrapAsync(getComments));
router.route('/follow').get(wrapAsync(getFollow));
router.route('/fans').get(wrapAsync(getFans));

module.exports = router;
