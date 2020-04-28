let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt')
let { Validator } = require('node-input-validator')
let { response } = require("../../../../helper/response")
let models = require('../../../../models/index')
let {
  generateAccessToken,
  generateRefreshToken } = require('../../../../helper/helper')  

router.post('/', async function(req, res) {
  
  let validator = new Validator(req.body, {
    "username": "required",
    "password": "required"
  })

  let match = await validator.check()

  if (!match) {
    return response(res, 412, validator.errors)
  }

  let {username, password} = req.body

  let matchUsername = await models.Auth.findOne({
    where: {
      username: username
    }
  })

  if (!matchUsername) {
    return response(res, 40401)
  }

  let matchPassword = await bcrypt.compare(password, matchUsername.password)

  if (!matchPassword) {
    return response(res, 40401)
  }

  let accessToken = generateAccessToken({
    logged: 1,
    _id: matchUsername.id
  })

  let refreshToken = generateRefreshToken(matchUsername.id)

  return response(res, 20003, {
    account: {
      username: matchUsername.username,
      slug: matchUsername.slug,
      name: matchUsername.name,
      photo: matchUsername.photo,
    },
    token: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    }
  })

})

module.exports = router;