const jwt = require('jsonwebtoken');
const rules = require('../validation/rules');
const auth = require('../validation/data/auth');
const TokenModel = require ('../models/Tokens');
const functions = require('../functions');

exports.classicAuth = (req, res, next) => {
  const invalidToken = !rules.valid(auth.tokenToValidate, req.headers.authorization);
  if (invalidToken) return functions.response(res, 401);
  const revokedToken = req.headers.authorization;
  TokenModel.findOne({ token: revokedToken })
    .then((revokedToken)=> {
      if (revokedToken !== null) return functions.response(res, 401);
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decodedToken = jwt.verify(token, 'HARIBO_C_EST_BEAU_LA_VIE');
        const userId = decodedToken.userId;
        const isAdmin = decodedToken.isAdmin;
        req.auth = {
          userId: userId,
          isAdmin: isAdmin
        };
        next();
      } catch (error) {
        functions.response(res, 401);
      }
    })
    .catch(error => functions.response(res, 500))
};

exports.adminAuth = (req, res, next) => {
  const invalidToken = !rules.valid(auth.tokenToValidate, req.headers.authorization);
  if (invalidToken) return functions.response(res, 403);
  const revokedToken = req.headers.authorization;
  TokenModel.findOne({ token: revokedToken })
    .then((revokedToken)=> {
      if (revokedToken !== null) return functions.response(res, 403);
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decodedToken = jwt.verify(token, 'HARIBO_C_EST_BEAU_LA_VIE');
        const userId = decodedToken.userId;
        const isAdmin = decodedToken.isAdmin;
        if (!isAdmin) throw error;
        req.auth = {
          userId: userId,
          isAdmin: isAdmin
        };
        next();
      } catch (error) {
        functions.response(res, 403);
      }
    })
    .catch(error => functions.response(res, 500))
};