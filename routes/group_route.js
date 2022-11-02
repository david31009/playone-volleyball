const router = require('express').Router();
const { wrapAsync } = require('../utils/util');
const { createGroup, getCards } = require('../controllers/group_controller');

router.route('/group').post(wrapAsync(createGroup));
router.route('/group').get(wrapAsync(getCards));

module.exports = router;
