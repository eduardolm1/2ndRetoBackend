const express = require('express')
const router = express.Router()
const PostController = require('../controllers/PostController')
const { authentication, isPostAuthor} = require('../middlewares/authentication')

router.post('/create', authentication, PostController.create);
router.put('/update/:id', authentication, isPostAuthor, PostController.update);
router.delete('/delete/:id', authentication, isPostAuthor, PostController.delete);
router.get('/', PostController.getAll);
router.get('/id/:_id', PostController.getPostById);
router.get('/name/:name', PostController.getPostByName);
router.put('/likes/:_id', authentication, PostController.like)
router.put('/dislikes/:_id', authentication, PostController.dislike)
module.exports = router