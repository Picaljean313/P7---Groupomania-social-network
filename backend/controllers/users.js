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
const modifyOneUser = require('../validation/data/modifyOneUser');
const reqQueries = require('../validation/data/reqQueries');
const id = require ('../validation/data/id');
const rules = require ('../validation/rules');
const variables = require ('../variables');
const url = require ('url');
const fs = require ('fs');

exports.signup = async function (req, res, next) {
  const includedFile = req.file ? true : false;
  if (includedFile) {
    const includedUserBody = req.body.user ? true : false;
    if (!includedUserBody) return functions.unlinkFile(req, res, 400);
    const validUserFormData = rules.valid(signup.userFormDataToValidate, req.body.user);
    if (!validUserFormData) return functions.unlinkFile(req, res, 400);
    const validUserJson = rules.valid(signup.userJsonDataToValidate, JSON.parse(req.body.user)); 
    if (!validUserJson) return functions.unlinkFile(req, res, 400);
    const userObject = JSON.parse(req.body.user);
    const user = await UsersModel.findOne({ email: userObject.email })
      .catch(() => functions.unlinkFile(req, res, 500));
    if (user !== null) return functions.unlinkFile(req, res, 400);
    const hash = await bcrypt.hash(userObject.password, 10)
      .catch(() => functions.unlinkFile(req, res, 500));
    const userCreated = new UsersModel({
      pseudo : userObject.pseudo,
      imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      theme : userObject.theme,
      email : userObject.email,
      password : hash
    });
    await userCreated.save()
      .catch(() => functions.unlinkFile(req, res, 500));
    res.status(201).json({ message : "Account created." });
  } else {
    const validUserJson = rules.valid(signup.userJsonDataToValidate, req.body); 
    if (!validUserJson) return functions.response(res, 400);
    const user = await UsersModel.findOne({ email: req.body.email })
      .catch(() => functions.response(res, 500));
    if (user !== null) return functions.response(res, 400);
    const hash = await bcrypt.hash(req.body.password, 10)
      .catch(() => functions.response(res, 500));
    const userCreated = new UsersModel({
      pseudo : req.body.pseudo,
      theme : req.body.theme,
      email : req.body.email,
      password : hash
    });
    await userCreated.save()
      .catch(() => functions.response(res, 500));
    res.status(201).json({ message : "Account created." });
  }
};

exports.login = async function (req, res, next) {
  const validLoginData = typeof req.body.email === "string" ? rules.valid(login.loginDataToValidate, [req.body.email.trim(), req.body.password]) : false;
  if(!validLoginData) return functions.response(res, 400);
  const user = await UsersModel.findOne({ email: req.body.email.trim() })
    .catch(() => functions.response(res, 500));
  if (user === null) return functions.response(res, 400);
  const valid = await bcrypt.compare(req.body.password, user.password)
    .catch(() => functions.response(res, 500));
  if (!valid) return functions.response(res, 400); 
  const token = new TokensModel({
    token : jwt.sign(
      { 
        userId : user._id,
        isAdmin : user.isAdmin
      },
      'HARIBO_C_EST_BEAU_LA_VIE',
      { expiresIn: '24h' }
    )
  });
  await token.save()
    .catch(() => functions.response(res, 500))
  res.status(200).json({ token : token.token });
};

exports.logout = async function (req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  await TokensModel.deleteOne({ token : token })
    .catch(() => functions.response(res, 500))
  functions.response(res, 200);
};

exports.createOneUser = async function (req, res, next) {
  const includedFile = req.file ? true : false;
  if (includedFile) {
    const includedUserBody = req.body.user ? true : false;
    if (!includedUserBody) return functions.unlinkFile(req, res, 400);
    const validUserFormData = rules.valid(createOneUser.userFormDataToValidate, req.body.user);
    if (!validUserFormData) return functions.unlinkFile(req, res, 400);
    const validUserJson = rules.valid(createOneUser.userJsonDataToValidate, JSON.parse(req.body.user)); 
    if (!validUserJson) return functions.unlinkFile(req, res, 400);
    const userObject = JSON.parse(req.body.user);
    const user = await UsersModel.findOne({ email: userObject.email })
      .catch(() => functions.unlinkFile(req, res, 500));
    if (user !== null) return functions.unlinkFile(req, res, 400);
    const hash = await bcrypt.hash(userObject.password, 10)
      .catch(() => functions.unlinkFile(req, res, 500));
    const userCreated = new UsersModel({
      pseudo : userObject.pseudo,
      imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      theme : userObject.theme,
      email : userObject.email,
      password : hash,
      isAdmin : userObject.isAdmin
    });
    await userCreated.save()
      .catch(() => functions.unlinkFile(req, res, 500));
    res.status(201).json({ message : "Account created." });
  } else {
    const validUserJson = rules.valid(createOneUser.userJsonDataToValidate, req.body); 
    if (!validUserJson) return functions.response(res, 400);
    const user = await UsersModel.findOne({ email: req.body.email })
      .catch(() => functions.response(res, 500));
    if (user !== null) return functions.response(res, 400);
    const hash = await bcrypt.hash(req.body.password, 10)
      .catch(() => functions.response(res, 500));
    const userCreated = new UsersModel({
      pseudo : req.body.pseudo,
      theme : req.body.theme,
      email : req.body.email,
      password : hash,
      isAdmin : req.body.isAdmin
    });
    await userCreated.save()
      .catch(() => functions.response(res, 500));
    res.status(201).json({ message : "Account created." });
  }
};

exports.getAllUsers = async function (req, res, next) {
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
  const users = await UsersModel.find().sort({creationDate : sort}).where("creationDate").gte(minDate).lte(maxDate).limit(limit).lean()
    .catch(()=> functions.response(res, 500));
  if (req.query.activity === "true"){
    for (let user of users){
      const postsCount = PostsModel.count({ userId : user._id })
        .catch(()=> functions.response(res, 500));
      const commentsCount = CommentsModel.count({ userId : user._id })
        .catch(()=> functions.response(res, 500));
      const reactionsCount = ReactionsModel.count({ userId : user._id })
        .catch(()=> functions.response(res, 500));
      const activityArray = await Promise.all([postsCount, commentsCount, reactionsCount]);
      const userActivity = {
        posts : activityArray[0],
        comments : activityArray[1],
        reactions : activityArray[2]
      };
      user.activity = userActivity;
    }
  }
  res.status(200).json(users)
};

exports.deleteAllUsers = async function (req, res, next) {
  const userId = req.auth.userId;
  const imagesToDelete = [];
  const users = await UsersModel.find( { _id : { '$ne' : userId }})
    .catch(()=> functions.response(res, 500));
  for (let user of users){
    imagesToDelete.push(user.imageUrl.split('images/')[1]);
  };
  const posts = await PostsModel.find( { userId : { '$ne' : userId }})
    .catch(()=> functions.response(res, 500));
  for (let post of posts){
    if (post.imageUrl){
      imagesToDelete.push(post.imageUrl.split('images/')[1]);
    }
  };
  const defaultImageToKeep = variables.defaultImageUrl.split('images/')[1];
  function unlinkFile (file) {
    return fs.promises.unlink(`images/${file}`).catch(()=> functions.response(res, 500));
  };
  const promises =[];
  for (let image of imagesToDelete){
    if (image !== defaultImageToKeep){
    promises.push(unlinkFile(image));}
  };
  const deletedUsers = UsersModel.deleteMany({ _id : { '$ne' : userId }})
    .catch(()=> functions.response(res, 500));
  const deletedPosts = PostsModel.deleteMany({ userId : { '$ne' : userId }})
    .catch(()=> functions.response(res, 500));
  const deletedComments = CommentsModel.deleteMany({ userId : { '$ne' : userId }})
    .catch(()=> functions.response(res, 500));
  const deletedReactions = ReactionsModel.deleteMany({ userId : { '$ne' : userId }})
    .catch(()=> functions.response(res, 500));
  const deletedReports = ReportsModel.deleteMany({ userId : { '$ne' : userId }})
    .catch(()=> functions.response(res, 500));
  promises.push(deletedUsers, deletedPosts, deletedComments, deletedReactions, deletedReports);
  await Promise.all(promises);
  res.status(200).json({ message : "Ok." })
};

exports.getOneUser = async function (req, res, next) {
  const allowedQueries = ["activity"]; 
  const reqQueriesObject = url.parse(req.url, true).query;
  const reqQueriesKeys = Object.keys(url.parse(req.url, true).query);
  for (let reqQueryKey of reqQueriesKeys){
    if (!allowedQueries.includes(reqQueryKey)) return functions.response(res, 400);
  };
  const validreqQueries = rules.valid(reqQueries.reqQueriesToValidate, reqQueriesObject);
  const invalidUserId = !rules.valid(id.idToValidate, req.params.userId);
  if (!validreqQueries || invalidUserId) return functions.response(res, 400);
  const user = await UsersModel.findOne({ _id : req.params.userId }).lean()
    .catch(()=> functions.response(res, 500));
  if (user === null) return functions.response(res, 400);
  if (!req.auth.isAdmin && req.auth.userId !== req.params.userId) return functions.response(res, 401);
  if (req.query.activity === "true"){
    const postsCount = PostsModel.count({ userId : user._id })
      .catch(()=> functions.response(res, 500));
    const commentsCount = CommentsModel.count({ userId : user._id })
      .catch(()=> functions.response(res, 500));
    const reactionsCount = ReactionsModel.count({ userId : user._id })
      .catch(()=> functions.response(res, 500));
    const activityArray = await Promise.all([postsCount, commentsCount, reactionsCount]);
    const userActivity = {
      posts : activityArray[0],
      comments : activityArray[1],
      reactions : activityArray[2]
    };
    user.activity = userActivity;
  }
  res.status(200).json(user)
};

exports.modifyOneUser = async function (req, res, next) {
  const allowedNonHashedProperties = ["pseudo", "theme", "email"];
  const userModified = {};
  const includedFile = req.file ? true : false;
  if (includedFile){
    const invalidUserId = !rules.valid(id.idToValidate, req.params.userId);
    if (invalidUserId) return functions.unlinkFile(req, res, 400);
    const user = await UsersModel.findOne({ _id : req.params.userId })
      .catch(()=> functions.unlinkFile(req, res, 500));
    if (user === null) return functions.unlinkFile(req, res, 400);
    if (!req.auth.isAdmin && req.auth.userId !== req.params.userId) return functions.unlinkFile(req, res, 401);
    userModified.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    if (req.body.user){
      const validUserFormData = rules.valid(modifyOneUser.userFormDataToValidate, req.body.user);
      if (!validUserFormData) return functions.unlinkFile(req, res, 400);
      const validUserJson = rules.valid(modifyOneUser.userJsonDataToValidate, JSON.parse(req.body.user));
      if (!validUserJson) return functions.unlinkFile(req, res, 400);
      const userReqBodyPropertiesToModify = Object.keys(JSON.parse(req.body.user)).filter(e => allowedNonHashedProperties.includes(e));
      if (userReqBodyPropertiesToModify.length !== 0){
        for (let property of userReqBodyPropertiesToModify) {
          userModified[property] = JSON.parse(req.body.user)[property];
        };
      }
      if (JSON.parse(req.body.user).password) {
        const hash = await bcrypt.hash(JSON.parse(req.body.user).password, 10)
          .catch(()=> functions.unlinkFile(req, res, 500));
        userModified.password = hash;
      };
      if (JSON.parse(req.body.user).isAdmin && req.auth.isAdmin) {
        userModified.isAdmin = JSON.parse(req.body.user).isAdmin;
      }
    } 
    await UsersModel.updateOne({ _id : req.params.userId }, userModified)
      .catch(()=> functions.unlinkFile(req, res, 500));
    functions.response(res, 200);
  } else {
    const invalidUserId = !rules.valid(id.idToValidate, req.params.userId);
    if (invalidUserId) return functions.response(res, 400);
    const user = await UsersModel.findOne({ _id : req.params.userId })
      .catch(()=> functions.response(res, 500));
    if (user === null) return functions.response(res, 400);
    if (!req.auth.isAdmin && req.auth.userId !== req.params.userId) return functions.response(res, 401);
    const validUserJson = rules.valid(modifyOneUser.userJsonDataToValidate, req.body);
    if (!validUserJson) return functions.response(res, 400);
    const userReqBodyPropertiesToModify = Object.keys(req.body).filter(e => allowedNonHashedProperties.includes(e));
    const isAdminChange = req.body.isAdmin && req.auth.isAdmin ? true : false;
    if(userReqBodyPropertiesToModify.length === 0 && !isAdminChange && !req.body.password) return functions.response(res, 400);
    for (let property of userReqBodyPropertiesToModify) {
      userModified[property] = req.body[property];
    };
    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, 10)
        .catch(()=> functions.response(res, 500));
      userModified.password = hash;
    };
    if (isAdminChange) {
      userModified.isAdmin = req.body.isAdmin;
    }
    await UsersModel.updateOne({ _id : req.params.userId }, userModified)
      .catch(()=> functions.response(res, 500));
    functions.response(res, 200);
  }
};

exports.deleteOneUser = async function (req, res, next) {
  const invalidUserId = !rules.valid(id.idToValidate, req.params.userId);
  if (invalidUserId) return functions.response(res, 400);
  const user = await UsersModel.findOne({ _id : req.params.userId })
    .catch(()=> functions.response(res, 500));
  if (user === null) return functions.response(res, 400);
  if (!req.auth.isAdmin && req.auth.userId !== req.params.userId) return functions.response(res, 401);
  const userImage = user.imageUrl.split('images/')[1];
  const deletedImage = user.imageUrl !== variables.defaultImageUrl ? fs.promises.unlink(`images/${userImage}`).catch(()=> functions.response(res, 500)) : "resolved";
  const deletedUser = UsersModel.deleteOne({ _id : req.params.userId })
    .catch(()=> functions.response(res, 500));
  const deletedPosts = PostsModel.deleteOne({ userId : req.params.userId })
    .catch(()=> functions.response(res, 500));
  const deletedComments = CommentsModel.deleteOne({ userId : req.params.userId })
    .catch(()=> functions.response(res, 500));
  const deletedReactions = ReactionsModel.deleteOne({ userId : req.params.userId })
    .catch(()=> functions.response(res, 500));
  const deletedReports = ReportsModel.deleteOne({ userId : req.params.userId })
    .catch(()=> functions.response(res, 500));
  await Promise.all([deletedImage, deletedUser, deletedPosts, deletedComments, deletedReactions, deletedReports]);
  res.status(200).json({ message : "Ok." })
};
