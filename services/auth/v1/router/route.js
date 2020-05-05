var express = require('express');
var router = express.Router()
var middleware = require('../middleware/authMiddleware')


var signupController = require('../controller/signupController');
var loginController = require('../controller/loginController');
var tokenController = require('../controller/tokenController');


router.use('/signup', signupController);
router.use('/login', loginController);
router.use('/token', tokenController);

router.use(middleware)
router.get('/middleware', function(req, res, next){

    return res.status(200).json({
        message: "granted"
    })

});


module.exports = router