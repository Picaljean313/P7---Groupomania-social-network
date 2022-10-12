const UsersModel = require ('../models/Users');
const PostsModel = require ('../models/Posts');
const CommentsModel = require ('../models/Comments');
const ReactionsModel = require ('../models/Reactions');
const ReportsModel = require ('../models/Reports');
const TokensModel = require ('../models/Tokens');
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const functions = require ('../functions');
const login = require ('../validation/data/login');
const signup = require ('../validation/data/signup');
const createOneUser = require('../validation/data/createOneUser');
const reqQueries = require('../validation/data/reqQueries');
const rules = require ('../validation/rules');
const url = require ('url');

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
  const allowedQueries = ["minDate", "maxDate", "limit", "sort", "activity"]; 
  const reqQueriesObject = url.parse(req.url, true).query;
  const reqQueriesKeys = Object.keys(url.parse(req.url, true).query);
  for (let reqQueryKey of reqQueriesKeys){
    if (!allowedQueries.includes(reqQueryKey)) return functions.response(res, 400);
  };
  const validParams = rules.valid(reqQueries.reqQueriesToValidate, reqQueriesObject);
  if (!validParams) return functions.response(res, 400);
  const minDate = req.query.minDate ? Date.parse(req.query.minDate) : 0;
  const maxDate = req.query.maxDate ? Date.parse(req.query.maxDate) : Date.now();
  const limit = req.query.limit ? Number(req.query.limit) : null;
  const sort = req.query.sort ? req.query.sort : null;
  async function findUsers (){
    try{
      const users = await UsersModel.find().sort({creationDate : sort}).where("creationDate").gte(minDate).lte(maxDate).limit(limit);
      if (req.query.activity === "true"){
        const usersUpdated = [];
        for (let user of users){
          const postsCount = PostsModel.count({ userId : user._id });
          const commentsCount = CommentsModel.count({ userId : user._id });
          const reactionsCount = ReactionsModel.count({ userId : user._id });
          const activityArray = await Promise.all([postsCount, commentsCount, reactionsCount]);
          const userActivity = {
            posts : activityArray[0],
            comments : activityArray[1],
            reactions : activityArray[2]
          };
          const userUpdated = {
            _id : user._id,
            pseudo : user.pseudo,
            imageUrl : user.imageUrl,
            theme : user.theme,
            email : user.email,
            password : user.password,
            creationDate : user.creationDate,
            isAdmin : user.isAdmin,
            __v : user.__v,
            activity : userActivity
          };
          usersUpdated.push(userUpdated);
        }
        return res.status(200).json(usersUpdated)
      } else {
        return res.status(200).json(users)
      }
    } catch {
      (error) => {functions.response(res, 500);}
    }
  };
  findUsers();
};

exports.deleteAllUsers = (req, res, next) => {
  const userId = req.auth.userId;
  async function deleteUsers () {
    try {
      const deletedUsers = UsersModel.deleteMany({ _id : { '$ne' : userId }});
      const deletedPosts = PostsModel.deleteMany({ userId : { '$ne' : userId }});
      const deletedComments = CommentsModel.deleteMany({ userId : { '$ne' : userId }});
      const deletedReactions = ReactionsModel.deleteMany({ userId : { '$ne' : userId }});
      const deletedReports = ReportsModel.deleteMany({ userId : { '$ne' : userId }});
      await Promise.all([deletedUsers, deletedPosts, deletedComments, deletedReactions, deletedReports]);
      res.status(200).json({ message : "Ok." })
    } catch {
      functions.response(res, 500);
    }
  };
  deleteUsers();
};

exports.getOneUser = (req, res, next) => {

};

exports.modifyOneUser = (req, res, next) => {

};

exports.deleteOneUser = (req, res, next) => {

};
