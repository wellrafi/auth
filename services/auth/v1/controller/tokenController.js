let express = require('express');
let route = express.Router();
let models = require('../../../../models/index');
let { response } = require('../../../../helper/response');


let {
  fetchRefreshToken,
  generateAccessToken
} = require('../../../../helper/helper')

route.post('/', async function(req, res) {
  let refreshToken = req.body.token


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

})

module.exports = route