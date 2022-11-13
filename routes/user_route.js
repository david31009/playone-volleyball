const router = require('express').Router();
const { wrapAsync } = require('../utils/util');
const { signup, signin } = require('../controllers/user_controller');

router.route('/user/signup').post(wrapAsync(signup));
router.route('/user/signin').post(wrapAsync(signin));

module.exports = router;
