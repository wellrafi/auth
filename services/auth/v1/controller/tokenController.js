let express = require('express');
let route = express.Router();
let models = require('../../../../models/index');
let { response } = require('../../../../helper/response');
let {IncomingForm} = require('formidable')

let {
  fetchRefreshToken,
  generateAccessToken,
  checkKeysObject
} = require('../../../../helper/helper')

route.post('/', async function(req, res) {

  let headers = req.headers["content-type"].toString();

  if (headers.indexOf('form-data') > 0) {
    let form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      return storeToken(req, res, fields);
    })
  }

  if (headers.indexOf("json") > 0) {
    return storeToken(req, res, req.body);
  }

})

async function storeToken(req, res, body) {

  const checkReqObject = checkKeysObject([body], ['token'])
  if (checkReqObject) {
    return response(res, 422, checkReqObject)
  }

  let refreshToken = body.token

  const match = fetchRefreshToken(refreshToken)
  if (!match) {
    return response(res, 422)
  }
  
  let checkId = await models.Token.findOne({
    token: match
  });

  if (!checkId) {
    return response(res, 404)
  }

  const accessToken = generateAccessToken({
    _id: match
  })

  return response(res, 200, {
    token: {
      accessToken: accessToken
    }
  })
}

module.exports = route