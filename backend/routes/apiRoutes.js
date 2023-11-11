const {Router} = require('express');
const jwt = require('jsonwebtoken');
const apiController = require('../controllers/apiControllers.js')

const router = Router();

router.get('/api/users', apiController.checkUser)
router.post('/api/chats', apiController.chats)

module.exports = router