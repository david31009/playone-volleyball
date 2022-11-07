const router = require('express').Router();
const { wrapAsync } = require('../utils/util');
const { updateUser } = require('../controllers/user_controller');

router.route('/user').put(wrapAsync(updateUser));

module.exports = router;
