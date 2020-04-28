let express = require('express');
let router = express.Router();
let niv, {Validator} = require('node-input-validator');
let models = require('../../../../models/index');
let hash = require('bcrypt');
let saltRounds = 10;
let fs = require('fs');
let {
  isEmpty, 
  slug, 
  roleId,
  generateAccessToken,
  generateRefreshToken,
  fetchToken,
  uniqueAsync
  } = require('../../../../helper/helper')  


let { response } = require('../../../../helper/response')
  
const { v4: uuidv4 } = require('uuid');

router.get('/', function(req, res) {
  console.log("perfect coy")
  return res.send("soasdfasdf")
})

router.post('/testing', async function(req, res, next) {
  let match = fetchToken(req.body.token)
  if (match === false) {
    return response(res, 401)
  }
  return response(res, 200)
})

router.post('/', async function(req, res) {

  // ngubah requets body ke array
  let body = req.body.length > 0 ? req.body : [req.body];

  // validasi request dari user
  const validate = new Validator(body, {
    "*.username": "required|minLength:4",
    "*.email": "email",
    "*.password": 'required|minLength:8'
  })

  // koreksi ada yang nggk sama validasinya
  const matched = await validate.check();

  // kalo ada yang salah
  if (!matched) {

    // return response 422
    return response(res, 422, {errors: validate.errors});
  }

  // ngambil list username dari array request bodu 
  // untuk bisa di cek
  let listUsername = body.map(value => {
    return value.username
  })

  // cek attribute unik
  let uniqueCheck = await uniqueAsync(res, 'Auth', 'username', listUsername)

  // kalo ada attribute yang sama 
  if (uniqueCheck) {
    return response(res, 422, {errors: uniqueCheck})
  }

  // filter & nyiapin data yang bakal di input ke model
  let bulkBody = body.map(value => {

    // hash password user
    let hashing = hash.hashSync(value.password, saltRounds);

    return {
      id: uuidv4(),
      email: isEmpty(value.email),
      username: isEmpty(value.username),
      password: hashing,
      slug: '@' + slug(value.username),
      name: isEmpty(value.name),
      address: isEmpty(value.address),
      photo: isEmpty(value.photo),
      postCode: isEmpty(value.postCode),
      phoneNumber: isEmpty(value.phoneNumber),
      birthday: isEmpty(value.birthday),
      active: 1,
      roleId: roleId('user'),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  })
 
  // bulk insert ke model
  const insertAuth = await models.Auth.bulkCreate(bulkBody);

  // to json
  const userData = insertAuth.map((user) => user.get({plain: true}))
  
  if (!userData) {
    return response(res, 403)
  }

  if (req.body.length === undefined) {

    // kalo bulk insert nya berhasil
    let accessToken = generateAccessToken({
      logged: 1,
      _id: insertAuth[0].id
    })

    let refreshToken = generateRefreshToken(insertAuth[0].id)

    return response(res, 201, {
      account: {
        username: insertAuth[0].username,
        name: insertAuth[0].name,
        slug: insertAuth[0].slug,
        photo: insertAuth[0].photo,
      },
      token: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      }
    })

  }

  return response(res, 201)

})

module.exports = router;

