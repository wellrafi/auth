let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt')
let { Validator } = require('node-input-validator')
let { response } = require("../../../../helper/response")
let models = require('../../../../models/index')
let {IncomingForm} = require('formidable')
let {
  generateAccessToken,
  checkKeysObject,
  generateRefreshToken } = require('../../../../helper/helper')  

router.post('/', async function(req, res) {
  
  let headers = req.headers["content-type"].toString()

  if (headers.indexOf('form-data') > 0) {
    let form = new IncomingForm({ 
      multiples: true, 
      encoding: "utf-8",
      uploadDir: __dirname,
      maxFileSize: 1024 * 1024,
      maxFields: 10,
      maxFieldsSize: 4 * 1024 * 1024,
    })
    
    form.parse(req, (err, fields, file) => {
      storeDataSignIn(req, res, fields)
      return
    })
  }

  if (headers.indexOf('json') > 0) {
    storeDataSignIn(req, res, req.body)
    return
  }

})

async function storeDataSignIn(req, res, body) {

  const checkReqObject = checkKeysObject([body], ['username', 'password'])
  if (checkReqObject) {
    return response(res, 422, checkReqObject)
  }

  let validator = new Validator(body, {
    "username": "required",
    "password": "required"
  })

  let match = await validator.check()

  if (!match) {
    return response(res, 412, validator.errors)
  }

  let {username, password} = body

  let obSearch = {}
  if (username.indexOf('@') > 0){
    obSearch['email'] = username 
  } else {
    obSearch['username'] = username
  }


  let matchUsername = await models.Auth.findAll({
    where: obSearch
  })


  if (matchUsername.length < 1) {
    return response(res, 40401)
  }

  matchUsername = matchUsername[0].get({plain: true})

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
}



module.exports = router;