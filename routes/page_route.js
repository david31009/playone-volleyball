const router = require('express').Router();
const { wrapAsync } = require('../utils/util');
const { nextPage, allPage } = require('../controllers/page_controller');

router.route('/page').post(wrapAsync(nextPage));
router.route('/page').get(wrapAsync(allPage));

module.exports = router;
