
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authentication } = require('../middlewares/authentication');
const upload = require('../middlewares/upload');


router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', authentication, UserController.logout);
router.get('/getInfo/:id', authentication, UserController.getInfo);
router.get("/", authentication, UserController.getUsers);
router.put('/update', authentication, upload.single('image'), UserController.update);

module.exports = router