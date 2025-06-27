const express = require('express');
const router = express.Router();
const FollowController = require('../controllers/FollowController');
const { authentication } = require('../middlewares/authentication');

router.post('/follow/:id', authentication, FollowController.follow);
router.post('/unfollow/:id', authentication, FollowController.unfollow);

module.exports = router;