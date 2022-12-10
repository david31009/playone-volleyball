const router = require('express').Router();
const { wrapAsync, auth, injectionCheck } = require('../utils/util');
const {
  createGroup,
  getGroups,
  filterGroups,
  groupDetails,
  updateGroup,
  closeGroup,
  sseNotify
} = require('../controllers/group_controller');

router.route('/sse').get(wrapAsync(sseNotify));
router.route('/group').get(wrapAsync(getGroups));
router.route('/group').post(auth, injectionCheck, wrapAsync(createGroup));
router.route('/group').patch(auth, injectionCheck, wrapAsync(updateGroup));
router.route('/group').delete(auth, wrapAsync(closeGroup));
router.route('/filter/group').post(wrapAsync(filterGroups));
router.route('/group/details').get(wrapAsync(groupDetails));

module.exports = router;
