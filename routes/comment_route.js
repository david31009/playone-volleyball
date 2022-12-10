const router = require('express').Router();
const { wrapAsync, auth, injectionCheck } = require('../utils/util');
const {
  commentTitle,
  getCommentStatus,
  sendComment,
  getComments
} = require('../controllers/comment_controller');

router.route('/comment/title').post(auth, wrapAsync(commentTitle));
router.route('/comment/status').post(wrapAsync(getCommentStatus));
router.route('/comment').post(auth, injectionCheck, wrapAsync(sendComment));
router.route('/comment').get(wrapAsync(getComments));

module.exports = router;
