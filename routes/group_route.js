const router = require('express').Router();
const { wrapAsync, auth, injection } = require('../utils/util');
const {
  createGroup,
  getGroups,
  filterGroups,
  groupDetails,
  updateGroup,
  signupGroup,
  getSignupStatus,
  createMsg,
  getMsg,
  getSignupMembers,
  decideSignupStatus,
  closeGroup,
  nextPage,
  allPage
} = require('../controllers/group_controller');

router.route('/group').post(auth, injection, wrapAsync(createGroup));
router.route('/group').get(wrapAsync(getGroups));
router.route('/group').put(auth, injection, wrapAsync(updateGroup));
router.route('/filter').post(wrapAsync(filterGroups));
router.route('/group/details').get(wrapAsync(groupDetails));
router.route('/signup/group').post(auth, wrapAsync(signupGroup));
router.route('/signup/status').post(wrapAsync(getSignupStatus));
router.route('/msg').post(auth, injection, wrapAsync(createMsg));
router.route('/msg').get(wrapAsync(getMsg));
router.route('/member').get(wrapAsync(getSignupMembers));
router.route('/signup/status').put(auth, wrapAsync(decideSignupStatus));
router.route('/close/group').post(auth, wrapAsync(closeGroup));
router.route('/group/nextpage').post(wrapAsync(nextPage));
router.route('/group/allpage').get(wrapAsync(allPage));

module.exports = router;
