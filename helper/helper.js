require('dotenv').config()
let jwt = require("jsonwebtoken");
let { v4: uuidv4 } = require('uuid');
let crypto = require('crypto')
let models = require('../models/index')
let { Op } = require('sequelize')

exports.isEmpty = function (value) {
  return value === "" || value === undefined || value === null ? null : value
}

exports.slug = function (str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to   = "aaaaeeeeiiiioooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

  return str;
}

exports.roleId = function (role) {
  switch (role) {
    case "user":
        return "9896079a-796d-4f20-8a9e-aedb437bfb60";
      break;
    case "admin":
        return "9bb75588-96f3-4f87-9540-d84ce03f1755";
      break;
    case "operator":
        return "c30620f2-9f22-4f2d-918f-20b7862747be";
      break;
    case "superAdmin":
        return "d5c6c8f5-07b0-4969-b4ff-c6fcd27440ec";
      break;
  }
}

exports.uniqueAsync = async function (modelName, attributeName = [], attributeBody, except = []) {


  
    let whereClause = {}
    attributeName.forEach(attNameValue => {
      whereClause[attNameValue] = attributeBody[0][attNameValue]
    })

    // console.log(whereClause)
    // console.log(attributeBody)
    // return

    // model untuk cari attribute udah ada belum di table
    const response = await models[modelName].findAll({

      // attribute yang dipushcari
      where: {
        [Op.and]: whereClause
      }

    })

    // -- ingat pi .get({plain: true}) hanya bisa untuk object aja
    // -- kalo ada kasus array of object pake map terus di masing2 object kasih .get({plain: true}) ini
    // ngubah ke object
    let listUsername = response.map((node) => {
      let dahJadiObject = node.get({ plain: true })
      return dahJadiObject.username
    });

    // except
    // untuk remove list username 
    if (except.length > 0) {
      listUsername = listUsername.filter(function(valUsername) {
        except.forEach(valExceptUsername => {
          return valExceptUsername !== valUsername
        })    
      })
    }

    let count = listUsername.length

    if (count === 0) {
      return 
    }

    let ob = {}

    // kalau ketemu attribute yang sama
    if (count > 1 ) {

      // attributeBody.forEach(attBodyValue => {
      //   attributeName.forEach((attNameValue, index) => {
      //     ob[`${index}.${attNameValue}`] = {
      //       "message": `${attNameValue} already used`,
      //       "rule": "unique"
      //     }
      //   })
      // })

      return ob

    } else {

      attributeName.forEach((attNameValue) => {
        ob[`${attNameValue}`] = {
          "message": `${attNameValue} already used`,
          "rule": "unique"
        }
      })
  
      return ob
      
    }

}


exports.checkKeysObject = function(body, _listKeys) {
  let bodyObject = body[0];
  let bodyObjectKeys = Object.keys(bodyObject);
  let listKeys = _listKeys;
  let checkKeys = []
  listKeys.forEach((valueKey) => {
    if (bodyObjectKeys.indexOf(valueKey) === -1) {
      let ob = {}
      ob[valueKey] = "Data value not found"
      checkKeys.push(ob)
    }
  });
  if (checkKeys.length > 0) {
    return {errors: checkKeys}
  }
  return false
}


exports.createImageBase64 = function(base64) {
  
  // filename
  const fileName = Math.random().toString(36).slice(2) + 'rafiroyhan' + Math.random().toString(36).slice(2) + '.png'

  // path file 
  const path =  './public/media/uploads/' + fileName

  // data base 64
  const imgdata = base64

  // to convert base64 format into random filename
  const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
  
  // membuat file image dari base 64 lalu menyimpannya
  fs.writeFileSync(path, base64Data,  {encoding: 'base64'});

  return hostname + 'media/uploads/' + fileName
}

// untuk generate refresh token
exports.generateRefreshToken = function (value) {
  const refreshToken = generateToken(value, process.env.REFRESH_TOKEN, true)
  return refreshToken
}

// untuk generate access token
exports.generateAccessToken = function(value) {
  const refreshToken = generateToken(value, process.env.ACCESS_TOKEN)
  return refreshToken
}

// untuk fetch token
exports.fetchAccessToken = function (token) {
  const match = fetchToken(token, process.env.ACCESS_TOKEN)
  return match
}

// untuk fetch token
exports.fetchRefreshToken = function (refreshToken) {
  const match = fetchToken(refreshToken, process.env.REFRESH_TOKEN)
  return match
}


function fetchToken(token, secret) {
    // jumlah character string yang perlu di hapus
    let numberBit = 256

    // memisahkan token string dari tanda titik
    let tokenArray = token.split('.')
  
    // menghapus character dari string 
    tokenArray[1] = tokenArray[1].substring(0, tokenArray[1].length - numberBit)
  
    // menyatukan semua token array
    let finishToken = tokenArray.toString().replace(/,/g, '.')
  
    // cek token
    try {
      const fetching = jwt.verify(finishToken, secret)
      return fetching
    } catch {
      return false
    }
}

function generateToken(dataValue, secret, refreshToken) {
    // buat random string
    let random = crypto.randomBytes(128).toString('hex')

    // _token
    let _token = crypto.randomBytes(64).toString('hex')

    // sign token 
    let token = refreshToken 
                ? jwt.sign({
                  _token: _token
                }, secret, {expiresIn: '30d'})
                : jwt.sign(dataValue, secret, {expiresIn: '5h'})

    if (refreshToken) {
      models.Token.create({
        id: null,
        token: _token,
        authId: dataValue,
        createdAt: Date.now()
      }).then(result => {
        if (!result) {
          return response(res, 400)
        }
      })
    }
  
    // mecah token sesuai tanda titik
    let tokenArray = token.split('.')
  
    // masukin random string di array index 1 untuk mengecoh 
    tokenArray[1] = tokenArray[1] + random
  
    // menyatukan token array jadi string
    let tokenFinish = tokenArray.toString().replace(/,/g, '.')
  
    // return token yang dah jadi
    return tokenFinish
}