var express = require('express');
var router = express.Router()

var signupController = require('../controller/signupController');
var loginController = require('../controller/loginController');
var tokenController = require('../controller/tokenController');

router.use('/signup', signupController);
router.use('/login', loginController);
router.use('/token', tokenController);

module.exports = router