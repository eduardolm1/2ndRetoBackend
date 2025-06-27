const express = require('express')
const router = express.Router()
const CommentController = require('../controllers/CommentController')
const { authentication } = require('../middlewares/authentication')

router.post('/create/:postId', authentication, CommentController.create);
router.get('/id/:postId', CommentController.getByPost);
router.put('/:id', authentication, CommentController.update);
router.delete('/:id', authentication, CommentController.delete);
router.post('/like/:id', authentication, CommentController.like);
router.post('/dislike/:id', authentication, CommentController.dislike);

module.exports = router