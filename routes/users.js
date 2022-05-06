var express = require('express');
var router = express.Router();
const user = require('../controllers/user');

router.get('/login', user.renderLogin);

router.get('/register', user.renderRegister);

router.post('/register', user.register);

router.post('/login', user.login);

router.get('/logout', user.logout);

module.exports = router;
