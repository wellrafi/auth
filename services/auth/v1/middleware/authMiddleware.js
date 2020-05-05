require('dotenv').config();
let route = require('express').Router();
let { fetchAccessToken } = require('../../../../helper/helper')
let { response } = require('../../../../helper/response')


route.use(function(req, res, next) {

    try {
        let token = req.headers.authorization.split(' ')[1];
        let jwtVerify = fetchAccessToken(token);
        if (!jwtVerify) {
            return response(res, 401);
        }
        next();
    } catch (error) {
        return response(res, 401);
    }

})

module.exports = route;