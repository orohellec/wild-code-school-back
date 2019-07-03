const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');
const userController = require('../controllers/user');

router.post('/create-user', userController.postUser);
router.post('/login-user', userController.postLogin);
router.post('/add-movie-to-wishlist', isAuth, userController.postUserMovie);
router.delete('/remove-movie-to-wishlist/:movieId', isAuth, userController.deleteUserMovie);
router.get('/user', isAuth, userController.getUser);

module.exports = router;