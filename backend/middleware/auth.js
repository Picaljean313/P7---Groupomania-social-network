const jwt = require('jsonwebtoken');
const rules = require('../validation/rules');
const auth = require('../validation/data/auth');
const TokenModel = require ('../models/Tokens');
const UsersModel = require ('../models/Users');
const functions = require('../functions');

exports.classicAuth = async function (req, res, next) {
  const invalidBearerToken = !rules.valid(auth.tokenToValidate, req.headers.authorization);
  if (invalidBearerToken) return functions.response(res, 401);

  const tokenSplited = req.headers.authorization.split(' ')[1];
  let token;
  try {
    token = await TokenModel.findOne({ token: tokenSplited });
  } catch {
    console.log("Can't find token.");
    return functions.response(res, 500);
  }
  if (token === null) return functions.response(res, 401);

  const decodedToken = jwt.verify(token.token, 'HARIBO_C_EST_BEAU_LA_VIE', (error, decodedToken)=> {
    return decodedToken
  });
  if (decodedToken === undefined) return functions.response(res, 401);
  
  const userId = decodedToken["userId"];
  const isAdmin = decodedToken["isAdmin"];
  req.auth = {
    userId: userId,
    isAdmin: isAdmin
  };
  let user;
  try {
    user = await UsersModel.findOne({ _id : req.auth.userId });
  } catch {
    console.log("Can't find user.");
    return functions.response(res, 500);
  }
  if (user === null) return functions.response(res, 401);

  next();
};

exports.adminAuth = async function (req, res, next) {
  const invalidBearerToken = !rules.valid(auth.tokenToValidate, req.headers.authorization);
  if (invalidBearerToken) return functions.response(res, 403);

  const tokenSplited = req.headers.authorization.split(' ')[1];
  let token;
  try {
    token = await TokenModel.findOne({ token: tokenSplited });
  } catch {
    console.log("Can't find token.");
    return functions.response(res, 500);
  }
  if (token === null) return functions.response(res, 403);

  const decodedToken = jwt.verify(token.token, 'HARIBO_C_EST_BEAU_LA_VIE', (error, decodedToken)=> {
    return decodedToken
  });
  if (decodedToken === undefined) return functions.response(res, 403);

  const userId = decodedToken["userId"];
  const isAdmin = decodedToken["isAdmin"];
  if (!isAdmin) return functions.response(res, 403);

  req.auth = {
    userId: userId,
    isAdmin: isAdmin
  };

  let user;
  try {
    user = await UsersModel.findOne({ _id : req.auth.userId });
  } catch {
    console.log("can't find user.");
    return functions.response(res, 500);
  }
  if (user === null) return functions.response(res, 403);
  
  next();
};