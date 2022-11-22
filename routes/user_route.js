const router = require('express').Router();
const { wrapAsync, auth } = require('../utils/util');
const {
  signup,
  signin,
  profile,
  loginCheck
} = require('../controllers/user_controller');

router.route('/user/signup').post(wrapAsync(signup));
router.route('/user/signin').post(wrapAsync(signin));
router.route('/user/profile').get(auth, wrapAsync(profile));
router.route('/user/auth').get(auth, wrapAsync(loginCheck));

module.exports = router;
