const jwt = require('jsonwebtoken');
const rules = require('../validation/rules');
const auth = require('../validation/data/auth');
const TokenModel = require ('../models/Tokens');

exports.classicAuth = (req, res, next) => {
  const invalidToken = !rules.valid(auth.tokenToValidate, req.headers.authorization);
  if (invalidToken) return res.status(401).json({ message: "Unauthorized request."});
  const revokedToken = req.headers.authorization;
  TokenModel.findOne({ token: revokedToken })
    .then((revokedToken)=> {
      if (revokedToken !== null) return res.status(401).json({ message: "Unauthorized request."});
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
        res.status(401).json({ message: "Unauthorized request."});
      }
    })
    .catch(error => { res.status(500).json({ message: "Server error."}); })
};

exports.adminAuth = (req, res, next) => {
  const invalidToken = !rules.valid(auth.tokenToValidate, req.headers.authorization);
  if (invalidToken) return res.status(403).json({ message: "Forbidden request."});
  const revokedToken = req.headers.authorization;
  TokenModel.findOne({ token: revokedToken })
    .then((revokedToken)=> {
      if (revokedToken !== null) return res.status(403).json({ message: "Forbidden request." });
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
        res.status(403).json({ message: "Forbidden request." });
      }
    })
    .catch(error => { res.status(500).json({ message: "Server error."}); })
};