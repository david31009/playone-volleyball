const router = require('express').Router();
const { wrapAsync } = require('../utils/util');
const {
  createGroup,
  getCards,
  filterCards,
} = require('../controllers/group_controller');

router.route('/group').post(wrapAsync(createGroup));
router.route('/group').get(wrapAsync(getCards));
router.route('/filter').post(wrapAsync(filterCards));

module.exports = router;
