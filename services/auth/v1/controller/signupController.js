require('dotenv').config()
let express = require('express');
let router = express.Router();
let path = require('path');
let _ = require('lodash');
let niv, {Validator} = require('node-input-validator');
let models = require('../../../../models/index');
let hash = require('bcrypt');
let saltRounds = 10;
let jimp = require('jimp');
let fs = require('fs');
var { IncomingForm } = require('formidable');

let {
  isEmpty, 
  slug, 
  roleId,
  generateAccessToken,
  generateRefreshToken,
  fetchToken,
  uniqueAsync,
  checkKeysObject
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

  // _.some(req.body, _.isEmpty) === false 
  // digunakan untuk cek object yang kosong
  
  // cek jika req.body kosong
  if (!req.body || _.some(req.body, _.isEmpty) === false) {

    let form = new IncomingForm({ 
      multiples: true, 
      encoding: "utf-8",
      uploadDir: __dirname,
      maxFileSize: 1024 * 1024,
      maxFields: 10,
      maxFieldsSize: 4 * 1024 * 1024,
    
    })

    
    form.parse(req, function (err, fields, files) {
       
      storeDataSignUp(req, res, fields)
      
    })

    // form.on('fileBegin', function(name, file){


    //   let random = require('crypto').randomBytes(64).toString('hex');
    //   let ext = file.type.split('/')[1];
    //   let fileName = `${random}.${ext}`
    //   let pathDir = __dirname.toString().replace('v1/controller', '')
      
    //   file.path = `${pathDir}/public/media/${fileName}`;

    // })

    // form.on('file', function(name, file) {

    //   jimp.read(file.path)
    //     .then(image => {
    //       image
    //         .cover(250,250)
    //         .quality(80)
    //         .crop( 0, 0, 250, 250)
    //         .write(file.path)
    //     })

    // })

  } else { 
    storeDataSignUp(req, res, req.body)
  }

})


async function storeDataSignUp(req, res, reqBody, reqFiles) {

  // ngubah requets body ke array
  let body = reqBody.length > 0 ? reqBody : [reqBody];

  // script ini untuk ngecek keys pada object requestnya
  const checkReqObject = checkKeysObject(body, ['username', 'email', 'password'])
  if (checkReqObject) {
    return response(res, 422, checkReqObject)
  }

  // validasi request dari user
  const validate = new Validator(body, {
    "*.username": "required|minLength:4",
    "*.email": "required|email",
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
    return { username: value.username, email: value.email }
  })

  // cek attribute unik
  let uniqueCheck = await uniqueAsync('Auth', ['email', 'username'], listUsername)

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
      photo: process.env.HOSTNAME + '/media/avatar.png',
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
}


module.exports = router;

