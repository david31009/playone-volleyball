const router = require('express').Router();
const { wrapAsync } = require('../utils/util');
const {
  createGroup,
  getGroups,
  filterGroups,
  groupDetails,
  updateGroup,
  signupGroup,
  getSignupStatus,
} = require('../controllers/group_controller');

router.route('/group').post(wrapAsync(createGroup));
router.route('/group').get(wrapAsync(getGroups));
router.route('/update/group').post(wrapAsync(updateGroup));
router.route('/filter').post(wrapAsync(filterGroups));
router.route('/group/details').get(wrapAsync(groupDetails));
router.route('/signup/group').post(wrapAsync(signupGroup));
router.route('/signup/status').post(wrapAsync(getSignupStatus));

module.exports = router;
