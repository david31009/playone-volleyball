const router = require('express').Router();
const { wrapAsync } = require('../utils/util');
const {
  createGroup,
  getGroups,
  filterGroups,
  groupDetails,
} = require('../controllers/group_controller');

router.route('/group').post(wrapAsync(createGroup));
router.route('/group').get(wrapAsync(getGroups));
router.route('/filter').post(wrapAsync(filterGroups));
router.route('/group/details').get(wrapAsync(groupDetails));

module.exports = router;
