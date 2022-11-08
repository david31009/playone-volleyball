const router = require('express').Router();
const { wrapAsync } = require('../utils/util');
const { updateUser, userProfile } = require('../controllers/user_controller');

router.route('/user').put(wrapAsync(updateUser));
router.route('/user').get(wrapAsync(userProfile));

module.exports = router;
