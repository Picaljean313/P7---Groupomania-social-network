const UsersModel = require ('../models/Users');
const TokensModel = require ('../models/Tokens');
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const login = require ('../validation/data/login');
const rules = require ('../validation/rules');

exports.signup = (req, res, next) => {

};

exports.login = (req, res, next) => {
  const validLoginData = typeof req.body.email === "string" ? rules.valid(login.loginDataToValidate, [req.body.email.trim(), req.body.password]) : false;
  if(!validLoginData) return res.status(400).json({ message: "Bad request." });
  UsersModel.findOne({ email: req.body.email.trim() })
    .then(user => {
      if (user === null) return res.status(400).json({ message: "Bad request." });
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) return res.status(400).json({ message: "Bad request." }); 
          res.status(200).json({
            token : jwt.sign(
              { 
                userId : user._id,
                isAdmin : user.isAdmin
              },
              'HARIBO_C_EST_BEAU_LA_VIE',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ message : "Server error." }));
    })
    .catch(error => res.status(500).json({ message: "Server error." }))
};

exports.logout = (req, res, next) => {
  const tokenToDelete = new TokensModel ({
    token : req.headers.authorization
  });
  tokenToDelete.save()
    .then(()=> { res.status(201).json({ message : "Token to revoke created." }); })
    .catch(error => {res.status(500).json({ message : "Server error." })})
};

exports.createOneUser = (req, res, next) => {

};

exports.getAllUsers = (req, res, next) => {

};

exports.deleteAllUsers = (req, res, next) => {

};

exports.getOneUser = (req, res, next) => {

};

exports.modifyOneUser = (req, res, next) => {

};

exports.deleteOneUser = (req, res, next) => {

};
