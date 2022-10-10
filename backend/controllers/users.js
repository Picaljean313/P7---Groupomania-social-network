const UsersModel = require ('../models/Users');
const TokensModel = require ('../models/Tokens');
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const functions = require ('../functions');
const login = require ('../validation/data/login');
const signup = require ('../validation/data/signup');
const createOneUser = require('../validation/data/createOneUser');
const rules = require ('../validation/rules');

exports.signup = (req, res, next) => {
  const includedFile = req.file ? true : false;
  if (includedFile) {
    const includedUserBody = req.body.user ? true : false;
    if (!includedUserBody) return functions.unlinkFile(req, res, 400);
    const validUserFormData = rules.valid(signup.userFormDataToValidate, req.body.user);
    if (!validUserFormData) return functions.unlinkFile(req, res, 400);
    const validUserJson = rules.valid(signup.userJsonDataToValidate, JSON.parse(req.body.user)); 
    if (!validUserJson) return functions.unlinkFile(req, res, 400);
    const userObject = JSON.parse(req.body.user);
    UsersModel.findOne({ email: userObject.email })
      .then(user => {
        if (user !== null) return functions.unlinkFile(req, res, 400);
        bcrypt.hash(userObject.password, 10)
          .then(hash => {
            const user = new UsersModel({
              pseudo : userObject.pseudo,
              imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
              theme : userObject.theme,
              email : userObject.email,
              password : hash
            });
            user.save()
              .then(()=> res.status(201).json({ message : "Account created." }))
              .catch(error => functions.unlinkFile(req, res, 500));
          })
          .catch(error => functions.unlinkFile(req, res, 500));
      })
      .catch(error => functions.unlinkFile(req, res, 500));
  } else {
    const validUserJson = rules.valid(signup.userJsonDataToValidate, req.body); 
    if (!validUserJson) return functions.response(res, 400);
    UsersModel.findOne({ email: req.body.email })
      .then(user => {
        if (user !== null) return functions.response(res, 400);
        bcrypt.hash(req.body.password, 10)
          .then(hash => {
            const user = new UsersModel({
              pseudo : req.body.pseudo,
              theme : req.body.theme,
              email : req.body.email,
              password : hash
            });
            user.save()
              .then(()=> res.status(201).json({ message : "Account created." }))
              .catch(error => functions.response(res, 500));
          })
          .catch(error => functions.response(res, 500));
      })
      .catch(error => functions.response(res, 500));
  }
};

exports.login = (req, res, next) => {
  const validLoginData = typeof req.body.email === "string" ? rules.valid(login.loginDataToValidate, [req.body.email.trim(), req.body.password]) : false;
  if(!validLoginData) return functions.response(res, 400);
  UsersModel.findOne({ email: req.body.email.trim() })
    .then(user => {
      if (user === null) return functions.response(res, 400);
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) return functions.response(res, 400); 
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
        .catch(error => functions.response(res, 500));
    })
    .catch(error => functions.response(res, 500));
};

exports.logout = (req, res, next) => {
  const tokenToRevoke = new TokensModel ({
    token : req.headers.authorization
  });
  tokenToRevoke.save()
    .then(()=> { res.status(201).json({ message : "Token to revoke created." }); })
    .catch(error => functions.response(res, 500));
};

exports.createOneUser = (req, res, next) => {
  const includedFile = req.file ? true : false;
  if (includedFile) {
    const includedUserBody = req.body.user ? true : false;
    if (!includedUserBody) return functions.unlinkFile(req, res, 400);
    const validUserFormData = rules.valid(createOneUser.userFormDataToValidate, req.body.user);
    if (!validUserFormData) return functions.unlinkFile(req, res, 400);
    const validUserJson = rules.valid(createOneUser.userJsonDataToValidate, JSON.parse(req.body.user)); 
    if (!validUserJson) return functions.unlinkFile(req, res, 400);
    const userObject = JSON.parse(req.body.user);
    UsersModel.findOne({ email: userObject.email })
      .then(user => {
        if (user !== null) return functions.unlinkFile(req, res, 400);
        bcrypt.hash(userObject.password, 10)
          .then(hash => {
            const user = new UsersModel({
              pseudo : userObject.pseudo,
              imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
              theme : userObject.theme,
              email : userObject.email,
              password : hash,
              isAdmin : userObject.isAdmin
            });
            user.save()
              .then(()=> res.status(201).json({ message : "Account created." }))
              .catch(error => functions.unlinkFile(req, res, 500));
          })
          .catch(error => functions.unlinkFile(req, res, 500));
      })
      .catch(error => functions.unlinkFile(req, res, 500));
  } else {
    const validUserJson = rules.valid(createOneUser.userJsonDataToValidate, req.body); 
    if (!validUserJson) return functions.response(res, 400);
    UsersModel.findOne({ email: req.body.email })
      .then(user => {
        if (user !== null) return functions.response(res, 400);
        bcrypt.hash(req.body.password, 10)
          .then(hash => {
            const user = new UsersModel({
              pseudo : req.body.pseudo,
              theme : req.body.theme,
              email : req.body.email,
              password : hash,
              isAdmin : req.body.isAdmin
            });
            user.save()
              .then(()=> res.status(201).json({ message : "Account created." }))
              .catch(error => functions.response(res, 500));
          })
          .catch(error => functions.response(res, 500));
      })
      .catch(error => functions.response(res, 500));
  }
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
