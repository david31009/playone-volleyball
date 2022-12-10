const router = require('express').Router();
const { wrapAsync, auth, injectionCheck } = require('../utils/util');
const { createMsg, getMsg } = require('../controllers/message_controller');

router.route('/msg').post(auth, injectionCheck, wrapAsync(createMsg));
router.route('/msg').get(wrapAsync(getMsg));

module.exports = router;
