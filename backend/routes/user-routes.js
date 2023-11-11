const {Router} = require('express');
const userController = require('../controllers/user-controller')

const router = Router();

router.post('/signup', userController.signup_post);
router.post('/login', userController.login_post);
router.get('/logout', userController.logout_get);

module.exports = router