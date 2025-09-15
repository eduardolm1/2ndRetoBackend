const express = require('express')
const router = express.Router()
const PostController = require('../controllers/PostController')
const { authentication, isPostAuthor } = require('../middlewares/authentication')
const upload = require('../middlewares/upload')

router.post('/create', authentication, upload.array('media', 5), PostController.create);
router.put('/update/:id', authentication, isPostAuthor, upload.array('media', 5), PostController.update);
router.delete('/delete/:id', authentication, isPostAuthor, PostController.delete);
router.get('/', PostController.getAll);
router.get('/id/:_id', PostController.getPostById);
router.get('/name/:name', PostController.getPostByName);
router.get('/media/:filename', PostController.getMedia);
router.put('/likes/:_id', authentication, PostController.like)
router.put('/dislikes/:_id', authentication, PostController.dislike)

module.exports = router;