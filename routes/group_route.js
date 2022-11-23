const router = require('express').Router();
const { wrapAsync, auth } = require('../utils/util');
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
  testGroup,
  testPage,
  nextPage
} = require('../controllers/group_controller');

router.route('/group').post(auth, wrapAsync(createGroup));
router.route('/group').get(wrapAsync(getGroups));
router.route('/update/group').post(wrapAsync(updateGroup));
router.route('/filter').post(wrapAsync(filterGroups));
router.route('/group/details').get(wrapAsync(groupDetails));
router.route('/signup/group').post(auth, wrapAsync(signupGroup));
router.route('/signup/status').post(wrapAsync(getSignupStatus));
router.route('/msg').post(auth, wrapAsync(createMsg));
router.route('/msg').get(wrapAsync(getMsg));
router.route('/member').get(wrapAsync(getSignupMembers));
router.route('/update/signup/status').post(wrapAsync(decideSignupStatus));
router.route('/close/group').post(wrapAsync(closeGroup));
router.route('/group/nextpage').post(wrapAsync(nextPage));

module.exports = router;
